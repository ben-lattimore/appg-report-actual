'use client';

import { SubcategorySummary } from '@/types/appg';

interface CategoryFundingColumnsProps {
  yearSummaries: {
    year: number;
    allSubcategories: SubcategorySummary[];
  }[];
}

export default function CategoryFundingColumns({ yearSummaries }: CategoryFundingColumnsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Group subcategories by category and sum their totals
  const getCategoryTotals = (subcategories: SubcategorySummary[]) => {
    const categoryMap = new Map<string, { totalAmount: number; appgCount: number; subcategoryCount: number }>();
    
    subcategories.forEach(sub => {
      const existing = categoryMap.get(sub.category) || { totalAmount: 0, appgCount: 0, subcategoryCount: 0 };
      categoryMap.set(sub.category, {
        totalAmount: existing.totalAmount + sub.totalAmount,
        appgCount: existing.appgCount + sub.appgCount,
        subcategoryCount: existing.subcategoryCount + 1
      });
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Funded Categories by Year</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {yearSummaries.map(({ year, allSubcategories }) => {
          const categoryTotals = getCategoryTotals(allSubcategories);
          const topCategories = categoryTotals.slice(0, 10);
          
          return (
            <div key={year} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{year}</h3>
                <p className="text-sm text-gray-600">
                  {categoryTotals.length} categories with funding
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {topCategories.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {category.category}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {category.subcategoryCount} subcategories • {category.appgCount} APPGs
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(category.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {categoryTotals.length > 10 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      +{categoryTotals.length - 10} more categories
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