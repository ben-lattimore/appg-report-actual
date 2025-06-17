import { getCachedAggregates } from '@/lib/data';
import YearlyFundingColumns from '@/components/YearlyFundingColumns';
import Navigation from '@/components/Navigation';
import PageHeader from '@/components/PageHeader';

export default async function APPGFundingPage() {
  const data = await getCachedAggregates();

  // Transform data to pass allGroups to YearlyFundingColumns
  const yearSummariesWithAllGroups = data.yearSummaries.map(year => ({
    year: year.year,
    allGroups: year.allGroups
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeader 
        title="APPG Funding by Year" 
        description="Explore the top All-Party Parliamentary Groups by funding amount across different years."
      />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <YearlyFundingColumns yearSummaries={yearSummariesWithAllGroups} />
      </main>
    </div>
  );
}