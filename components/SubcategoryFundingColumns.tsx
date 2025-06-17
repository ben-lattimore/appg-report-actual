'use client';

import { SubcategorySummary } from '@/types/appg';

interface SubcategoryFundingColumnsProps {
  yearSummaries: {
    year: number;
    allSubcategories: SubcategorySummary[];
  }[];
}

export default function SubcategoryFundingColumns({ yearSummaries }: SubcategoryFundingColumnsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Funded Subcategories by Year</h2>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${yearSummaries.length}, 1fr)` }}>
        {yearSummaries.map(({ year, allSubcategories }) => {
          const topSubcategories = allSubcategories.slice(0, 10);
          
          return (
            <div key={year} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{year}</h3>
                <p className="text-sm text-gray-600">
                  {allSubcategories.length} subcategories with funding
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {topSubcategories.map((subcategory, index) => (
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
                
                {allSubcategories.length > 10 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      +{allSubcategories.length - 10} more subcategories
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}