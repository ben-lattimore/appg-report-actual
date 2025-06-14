import { AggregatedData, YearSummary } from '@/types/appg';
import { getCachedAggregates } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  const data: AggregatedData = await getCachedAggregates();
  
  return data.yearSummaries.map((yearSummary) => ({
    year: yearSummary.year.toString(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { year } = await params;
  return {
    title: `APPG Benefits ${year} - Dashboard`,
    description: `APPG benefits analysis for ${year}`,
  };
}

export default async function YearDetail({ params }: Props) {
  const { year: yearParam } = await params;
  const data: AggregatedData = await getCachedAggregates();
  const year = parseInt(yearParam);
  const yearData = data.yearSummaries.find(y => y.year === year);
  
  if (!yearData) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-8">APPG Benefits {year}</h1>
      
      {/* Year Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Groups</h3>
          <p className="text-3xl font-bold text-blue-600">{yearData.totalGroups}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Groups with Benefits</h3>
          <p className="text-3xl font-bold text-green-600">{yearData.groupsWithBenefits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Value</h3>
          <p className="text-3xl font-bold text-purple-600">£{yearData.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Average Benefit</h3>
          <p className="text-3xl font-bold text-orange-600">£{Math.round(yearData.averageBenefit).toLocaleString()}</p>
        </div>
      </div>
      
      {/* Top Groups for Year */}
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Add the rest of your year detail content here */}
      </div>
    </div>
  );
}