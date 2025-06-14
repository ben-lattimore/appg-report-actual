"use client";

import { useState } from 'react';
import { FunderSummary } from '@/types/appg';

interface FunderColumnProps {
  year: number;
  funders: FunderSummary[];
}

function FunderColumn({ year, funders }: FunderColumnProps) {
  const [expandedFunders, setExpandedFunders] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setDisplayCount(prev => prev + 10);
    setIsLoading(false);
  };

  const displayedFunders = funders.slice(0, displayCount);
  const hasMore = displayCount < funders.length;

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

  const toggleFunderExpansion = (funderName: string) => {
    const newExpanded = new Set(expandedFunders);
    if (newExpanded.has(funderName)) {
      newExpanded.delete(funderName);
    } else {
      newExpanded.add(funderName);
    }
    setExpandedFunders(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{year}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Report Published: {getReportDate(year)}
        </p>
        <p className="text-sm text-gray-600">
          Top Funders of APPGs
        </p>
      </div>
      
      <div className="space-y-4">
        {displayedFunders.map((funder, index) => {
          const isExpanded = expandedFunders.has(funder.name);
          const visibleAppgs = isExpanded ? funder.appgs : funder.appgs.slice(0, 3);
          const remainingCount = funder.appgs.length - 3;
          
          return (
            <div 
              key={`${year}-${funder.name}`}
              className="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-green-500 rounded-full">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {funder.name}
                  </h3>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(funder.totalAmount)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {funder.appgCount} APPG{funder.appgCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {visibleAppgs.map((appg, appgIndex) => (
                  <div key={appg.name} className="bg-gray-50 rounded p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          APPG {appg.title.replace('All-Party Parliamentary Group', '').trim()}
                        </p>
                      </div>
                      <span className="text-green-600 font-medium ml-2">
                        {formatCurrency(appg.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {!isExpanded && remainingCount > 0 && (
                  <button
                    onClick={() => toggleFunderExpansion(funder.name)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-1 text-center border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    +{remainingCount} more
                  </button>
                )}
                
                {isExpanded && funder.appgs.length > 3 && (
                  <button
                    onClick={() => toggleFunderExpansion(funder.name)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-1 text-center border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              `Load Next 10 (${funders.length - displayCount} remaining)`
            )}
          </button>
        </div>
      )}
      
      {!hasMore && funders.length > 10 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing all {funders.length} funders
          </p>
        </div>
      )}
    </div>
  );
}

interface TopFundersColumnsProps {
  yearSummaries: Array<{
    year: number;
    topFunders: FunderSummary[];
  }>;
}

export default function TopFundersColumns({ yearSummaries }: TopFundersColumnsProps) {
  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Top Funders of APPGs (and What They Fund) Per Year
        </h2>
        <p className="text-gray-600">
          Discover which organizations provide the most funding to All-Party Parliamentary Groups each year.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {yearSummaries.map((yearData) => (
          <FunderColumn
            key={yearData.year}
            year={yearData.year}
            funders={yearData.topFunders}
          />
        ))})
      </div>
    </div>
  );
}