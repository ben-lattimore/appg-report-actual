import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');
const OUT = path.join(CACHE_DIR, 'aggregates.json');

// Function to extract funder name from source string
function extractFunderName(source) {
  // Handle null, undefined, or empty source
  if (!source || typeof source !== 'string') {
    return 'Unknown Funder';
  }
  
  // Remove common suffixes and clean up the funder name
  let funderName = source
    .replace(/\s+Secretariat\s+.*$/, '') // Remove "Secretariat" and everything after
    .replace(/\s+Joint\s+Secretariat\s+.*$/, '') // Remove "Joint Secretariat" and everything after
    .replace(/\s+\d{1,3}(,\d{3})*-\d{1,3}(,\d{3})*\s+.*$/, '') // Remove amount ranges and dates
    .trim();
  
  // Handle some common edge cases
  if (funderName.endsWith(' Joint')) {
    funderName = funderName.replace(' Joint', '');
  }
  
  // Return 'Unknown Funder' if we end up with an empty string
  return funderName || 'Unknown Funder';
}

// Add this helper function after the extractFunderName function
function roundToNearest1500(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return value;
  }
  return Math.round(value / 1500) * 1500;
}

export async function buildAggregates() {
  // Ensure cache directory exists
  await fs.mkdir(CACHE_DIR, { recursive: true });
  
  const files = await fs.readdir(RAW_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort();
  
  const yearSummaries = [];
  const groupMap = new Map();
  const yearFunderSummaries = [];
  
  for (const file of jsonFiles) {
    const filePath = path.join(RAW_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');
    const raw = JSON.parse(content);
    
    // Round total_benefits_value
    raw.total_benefits_value = roundToNearest1500(raw.total_benefits_value);
    
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
    
    // Process funders for this year
    const funderMap = new Map();
    
    for (const group of raw.appg_groups) {
      // Round benefits_in_kind values
      if (group.benefits_in_kind && Array.isArray(group.benefits_in_kind)) {
        group.benefits_in_kind = group.benefits_in_kind.map(value => roundToNearest1500(value));
      }
      
      // Round total_benefits (this becomes the 'total' field in the output)
      if (typeof group.total_benefits === 'number') {
        group.total_benefits = roundToNearest1500(group.total_benefits);
      }
      
      for (const benefit of group.benefits_details) {
        // Skip benefits with missing or invalid data
        if (!benefit || !benefit.source || typeof benefit.calculated_value !== 'number') {
          continue;
        }
        
        // Round calculated_value
        if (typeof benefit.calculated_value === 'number') {
          benefit.calculated_value = roundToNearest1500(benefit.calculated_value);
        }
        
        const funderName = extractFunderName(benefit.source);
        
        if (!funderMap.has(funderName)) {
          funderMap.set(funderName, {
            name: funderName,
            totalAmount: 0,
            appgCount: 0,
            appgs: []
          });
        }
        
        const funder = funderMap.get(funderName);
        funder.totalAmount += benefit.calculated_value;
        
        // Check if this APPG is already in the funder's list
        const existingAppg = funder.appgs.find(appg => appg.name === group.name);
        if (existingAppg) {
          existingAppg.amount += benefit.calculated_value;
        } else {
          funder.appgs.push({
            name: group.name,
            title: group.title,
            amount: benefit.calculated_value
          });
          funder.appgCount++;
        }
      }
    }
    
    // Sort ALL funders by total amount (not just top 10)
    const allFunders = Array.from(funderMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .map(funder => ({
        ...funder,
        appgs: funder.appgs.sort((a, b) => b.amount - a.amount) // Sort APPGs by amount
      }));
    
    // Get top 10 funders for quick access
    const topFunders = allFunders.slice(0, 10);
    
    yearFunderSummaries.push({
      year,
      topFunders,
      allFunders // Include ALL funders
    });
    
    // Calculate year summary
    const groupsWithBenefits = raw.appg_groups.filter(g => g.total_benefits > 0).length;
    const averageBenefit = groupsWithBenefits > 0 ? raw.total_benefits_value / groupsWithBenefits : 0;
    
    // Include ALL groups, not just top 20
    const allGroups = [...raw.appg_groups]
      .sort((a, b) => b.total_benefits - a.total_benefits)
      .map(g => ({
        name: g.name,
        title: g.title,
        total: g.total_benefits, // This will now be rounded
        benefitCount: g.benefits_details.length
      }));
    
    // Get top 10 groups for quick access
    const topGroups = allGroups.slice(0, 10);
    
    yearSummaries.push({
      year,
      totalGroups: raw.total_groups,
      groupsWithBenefits,
      totalValue: raw.total_benefits_value,
      averageBenefit,
      topGroups,
      allGroups, // Include ALL groups
      topFunders, // Add top 10 funder data to year summary
      allFunders // Add ALL funder data to year summary
    });
    
    // Process groups for cross-year analysis
    for (const group of raw.appg_groups) {
      if (!groupMap.has(group.name)) {
        groupMap.set(group.name, {
          name: group.name,
          title: group.title,
          yearlyData: []
        });
      }
      
      groupMap.get(group.name).yearlyData.push({
        year,
        totalBenefits: group.total_benefits, // This will also be rounded
        benefitCount: group.benefits_details.length
      });
    }
  }
  
  const aggregatedData = {
    yearSummaries: yearSummaries.sort((a, b) => a.year - b.year),
    groups: Array.from(groupMap.values()),
    yearFunderSummaries: yearFunderSummaries.sort((a, b) => a.year - b.year)
  };
  
  await fs.writeFile(OUT, JSON.stringify(aggregatedData, null, 2));
  console.log(`✅ Built aggregated data: ${OUT}`);
  
  return aggregatedData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildAggregates().catch(console.error);
}