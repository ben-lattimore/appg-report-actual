import { getCachedAggregates } from '@/lib/data';
import TopFundersColumns from '@/components/TopFundersColumns';
import Navigation from '@/components/Navigation';
import PageHeader from '@/components/PageHeader';

export default async function TopFundersPage() {
  const data = await getCachedAggregates();

  // Transform data to pass allFunders to TopFundersColumns  
  const yearSummariesWithAllFunders = data.yearSummaries.map(year => ({
    year: year.year,
    topFunders: year.allFunders
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeader 
        title="Top Funders of APPGs" 
        description="Discover which organizations provide the most funding to All-Party Parliamentary Groups each year."
      />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TopFundersColumns yearSummaries={yearSummariesWithAllFunders} />
      </main>
    </div>
  );
}