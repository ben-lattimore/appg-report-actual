'use client';

import { useState } from 'react';
import { SubcategorySummary } from '@/types/appg';

interface SubcategoryColumnProps {
  year: number;
  allSubcategories: SubcategorySummary[];
}

function SubcategoryColumn({ year, allSubcategories }: SubcategoryColumnProps) {
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setDisplayCount(prev => prev + 10);
    setIsLoading(false);
  };

  const displayedSubcategories = allSubcategories.slice(0, displayCount);
  const hasMore = displayCount < allSubcategories.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
      <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{year}</h3>
        <p className="text-sm text-gray-600">
          {allSubcategories.length} subcategories with funding
        </p>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {displayedSubcategories.map((subcategory, index) => (
            <div key={subcategory.name} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {subcategory.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {subcategory.category} • {subcategory.appgCount} APPGs
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(subcategory.totalAmount)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div className="mt-4 pt-3 border-t border-gray-100">
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
                `Load Next 10 (${allSubcategories.length - displayCount} remaining)`
              )}
            </button>
          </div>
        )}
        
        {!hasMore && allSubcategories.length > 10 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Showing all {allSubcategories.length} subcategories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SubcategoryFundingColumnsProps {
  yearSummaries: {
    year: number;
    allSubcategories: SubcategorySummary[];
  }[];
}

export default function SubcategoryFundingColumns({ yearSummaries }: SubcategoryFundingColumnsProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Funded Subcategories by Year</h2>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${yearSummaries.length}, 1fr)` }}>
        {yearSummaries.map(({ year, allSubcategories }) => (
          <SubcategoryColumn
            key={year}
            year={year}
            allSubcategories={allSubcategories}
          />
        ))}
      </div>
    </div>
  );
}