import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');
const OUT = path.join(CACHE_DIR, 'aggregates.json');

export async function buildAggregates() {
  // Ensure cache directory exists
  await fs.mkdir(CACHE_DIR, { recursive: true });
  
  const files = await fs.readdir(RAW_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort();
  
  const yearSummaries = [];
  const groupMap = new Map();
  
  for (const file of jsonFiles) {
    const filePath = path.join(RAW_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');
    const raw = JSON.parse(content);
    
    // Extract year from publication_date (format: "DDMMYY" like "200520" for 20th May 2020)
    let year;
    if (raw.publication_date.match(/^\d{6}$/)) {
      // Handle DDMMYY format
      const yearPart = raw.publication_date.slice(-2); // Get last 2 digits
      year = 2000 + parseInt(yearPart); // Convert YY to 20YY
    } else {
      // Handle full date format like "20 May 2020"
      year = parseInt(raw.publication_date.slice(-4));
    }
    
    // Calculate year summary
    const groupsWithBenefits = raw.appg_groups.filter(g => g.total_benefits > 0).length;
    const averageBenefit = groupsWithBenefits > 0 ? raw.total_benefits_value / groupsWithBenefits : 0;
    
    const topGroups = [...raw.appg_groups]
      .sort((a, b) => b.total_benefits - a.total_benefits)
      .slice(0, 20)
      .map(g => ({
        name: g.name,
        title: g.title,
        total: g.total_benefits,
        benefitCount: g.benefits_details.length
      }));
    
    yearSummaries.push({
      year,
      totalGroups: raw.total_groups,
      totalValue: raw.total_benefits_value,
      groupsWithBenefits,
      topGroups,
      averageBenefit
    });
    
    // Build group comparisons across years
    for (const group of raw.appg_groups) {
      if (!groupMap.has(group.name)) {
        groupMap.set(group.name, {
          name: group.name,
          title: group.title,
          yearlyData: [],
          totalAcrossYears: 0,
          averagePerYear: 0
        });
      }
      
      const comparison = groupMap.get(group.name);
      comparison.yearlyData.push({
        year,
        total: group.total_benefits,
        benefitCount: group.benefits_details.length
      });
      comparison.totalAcrossYears += group.total_benefits;
    }
  }
  
  // Calculate averages for group comparisons
  const groupComparisons = Array.from(groupMap.values()).map(group => ({
    ...group,
    averagePerYear: group.totalAcrossYears / group.yearlyData.length
  })).sort((a, b) => b.totalAcrossYears - a.totalAcrossYears);
  
  // Calculate overall stats
  const totalValue = yearSummaries.reduce((sum, year) => sum + year.totalValue, 0);
  const allGroups = groupComparisons.flatMap(g => 
    g.yearlyData.map(yd => ({ ...g, total: yd.total, benefitCount: yd.benefitCount }))
  );
  const mostFundedGroup = allGroups.reduce((max, group) => 
    group.total > max.total ? group : max, allGroups[0]
  );
  
  const aggregatedData = {
    yearSummaries: yearSummaries.sort((a, b) => a.year - b.year),
    groupComparisons,
    overallStats: {
      totalYears: yearSummaries.length,
      totalValue,
      totalGroups: groupComparisons.length,
      mostFundedGroup: {
        name: mostFundedGroup.name,
        title: mostFundedGroup.title,
        total: mostFundedGroup.total,
        benefitCount: mostFundedGroup.benefitCount
      }
    }
  };
  
  await fs.writeFile(OUT, JSON.stringify(aggregatedData, null, 2));
  return aggregatedData;
}

// Utility function to get cached data
export async function getCachedAggregates() {
  try {
    const content = await fs.readFile(OUT, 'utf8');
    return JSON.parse(content);
  } catch {
    // If cache doesn't exist, build it
    return await buildAggregates();
  }
}