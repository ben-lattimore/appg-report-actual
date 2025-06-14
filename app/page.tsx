import { AggregatedData } from '@/types/appg';
import { getCachedAggregates } from '@/lib/data';
import YearlyFundingColumns from '@/components/YearlyFundingColumns';

export default async function Dashboard() {
  const data: AggregatedData = await getCachedAggregates();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Top 10 APPGs by Funding Amount per Year
          </h1>
          <p className="text-lg text-gray-600">
            Explore the highest funded All-Party Parliamentary Groups across {data.yearSummaries.length} years
          </p>
        </div>
        
        <YearlyFundingColumns yearSummaries={data.yearSummaries} />
      </div>
    </div>
  );
}