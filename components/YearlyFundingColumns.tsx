"use client";

import { useState } from 'react';
import { GroupSummary } from '@/types/appg';

interface YearColumnProps {
  year: number;
  groups: GroupSummary[];
}

function YearColumn({ year, groups }: YearColumnProps) {
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setDisplayCount(prev => prev + 10);
    setIsLoading(false);
  };

  const displayedGroups = groups.slice(0, displayCount);
  const hasMore = displayCount < groups.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReportDate = (year: number) => {
    const reportDates: { [key: number]: string } = {
      2020: '20 May 2020',
      2021: '2 June 2021',
      2022: '4 May 2022',
      2023: '17 May 2023',
      2024: '30 May 2024',
      2025: '7 May 2025'
    };
    return reportDates[year] || `Report date for ${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{year}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Report Published: {getReportDate(year)}
        </p>
        <p className="text-sm text-gray-600">
          Top APPGs by funding amount
        </p>
      </div>
      
      <div className="space-y-3">
        {displayedGroups.map((group, index) => (
          <div 
            key={`${year}-${group.name}`}
            className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-500 rounded-full">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {group.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {group.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(group.total)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {group.benefitCount} benefit{group.benefitCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              `Load Next 10 (${groups.length - displayCount} remaining)`
            )}
          </button>
        </div>
      )}
      
      {!hasMore && groups.length > 10 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing all {groups.length} APPGs
          </p>
        </div>
      )}
    </div>
  );
}

interface YearlyFundingColumnsProps {
  yearSummaries: Array<{
    year: number;
    allGroups: GroupSummary[]; // Changed from topGroups to allGroups
  }>;
}

export default function YearlyFundingColumns({ yearSummaries }: YearlyFundingColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {yearSummaries.map((yearData) => (
        <YearColumn
          key={yearData.year}
          year={yearData.year}
          groups={yearData.allGroups} // Changed from topGroups to allGroups
        />
      ))}
    </div>
  );
}