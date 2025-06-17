import { AggregatedData } from '@/types/appg';
import { getCachedAggregates } from '@/lib/data';
import YearlyFundingColumns from '@/components/YearlyFundingColumns';
import TopFundersColumns from '@/components/TopFundersColumns';
import SubcategoryFundingColumns from '@/components/SubcategoryFundingColumns';
import Navigation from '@/components/Navigation';
import PageHeader from '@/components/PageHeader';

export default async function Home() {
  const data = await getCachedAggregates();

  // Transform data to pass allGroups to YearlyFundingColumns
  const yearSummariesWithAllGroups = data.yearSummaries.map(year => ({
    year: year.year,
    allGroups: year.allGroups
  }));

  // Transform data to pass allFunders to TopFundersColumns  
  const yearSummariesWithAllFunders = data.yearSummaries.map(year => ({
    year: year.year,
    topFunders: year.allFunders // Use allFunders instead of topFunders
  }));

  // NEW: Transform data to pass subcategories to SubcategoryFundingColumns
  const yearSummariesWithSubcategories = data.yearSummaries.map(year => ({
    year: year.year,
    allSubcategories: year.allSubcategories || []
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeader 
        title="APPG Funding Analysis" 
        description="Comprehensive analysis of All-Party Parliamentary Group funding across multiple years."
      />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NEW: Subcategory funding columns */}
        <SubcategoryFundingColumns yearSummaries={yearSummariesWithSubcategories} />
        
        {/* APPG funding columns with ALL groups */}
        <YearlyFundingColumns yearSummaries={yearSummariesWithAllGroups} />
        
      </main>
    </div>
  );
}