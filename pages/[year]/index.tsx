import { GetStaticProps, GetStaticPaths } from 'next';
import { AggregatedData, YearSummary } from '@/types/appg';
import { getCachedAggregates } from '@/lib/transform';
import Head from 'next/head';
import Link from 'next/link';

interface Props {
  yearData: YearSummary;
  year: number;
}

export default function YearDetail({ yearData, year }: Props) {
  return (
    <>
      <Head>
        <title>APPG Benefits {year} - Dashboard</title>
        <meta name="description" content={`APPG benefits analysis for ${year}`} />
      </Head>
      
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
          <h2 className="text-2xl font-bold mb-4">Top 20 Groups by Benefits ({year})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Group</th>
                  <th className="text-right py-2">Total Benefits</th>
                  <th className="text-right py-2">Benefit Count</th>
                </tr>
              </thead>
              <tbody>
                {yearData.topGroups.map((group, index) => (
                  <tr key={group.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-semibold">#{index + 1}</td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{group.title}</div>
                        <div className="text-sm text-gray-500">{group.name}</div>
                      </div>
                    </td>
                    <td className="text-right py-3 font-bold text-green-600">
                      £{group.total.toLocaleString()}
                    </td>
                    <td className="text-right py-3">{group.benefitCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getCachedAggregates();
  const paths = data.yearSummaries.map(year => ({
    params: { year: year.year.toString() }
  }));
  
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const year = parseInt(params?.year as string);
  const data = await getCachedAggregates();
  const yearData = data.yearSummaries.find(y => y.year === year);
  
  if (!yearData) {
    return { notFound: true };
  }
  
  return {
    props: { yearData, year },
    revalidate: 86400
  };
};