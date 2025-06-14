import { AggregatedData } from '@/types/appg';
import { getCachedAggregates } from '@/lib/data';
import YearlyFundingColumns from '@/components/YearlyFundingColumns';
import TopFundersColumns from '@/components/TopFundersColumns';

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

  return (
    <main className="mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          APPG Funding Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive analysis of All-Party Parliamentary Group funding across multiple years.
        </p>
      </div>

      {/* APPG funding columns with ALL groups */}
      <YearlyFundingColumns yearSummaries={yearSummariesWithAllGroups} />
      
      {/* Top Funders component with ALL funders */}
      <TopFundersColumns yearSummaries={yearSummariesWithAllFunders} />
    </main>
  );
}