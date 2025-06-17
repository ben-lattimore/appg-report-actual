'use client';

import { useState } from 'react';
import { SubcategorySummary, SubcategoryAPPG } from '@/types/appg';

interface SubcategoryModalProps {
  subcategory: SubcategorySummary | null;
  isOpen: boolean;
  onClose: () => void;
}

function SubcategoryModal({ subcategory, isOpen, onClose }: SubcategoryModalProps) {
  if (!isOpen || !subcategory) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{subcategory.name}</h2>
            <p className="text-sm text-gray-600">
              {subcategory.category} • {subcategory.appgCount} APPGs • Total: {formatCurrency(subcategory.totalAmount)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-3">
            {subcategory.appgs.map((appg, index) => (
              <div key={appg.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900">{appg.name}</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{appg.title}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(appg.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {subcategory.appgs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No APPGs found in this subcategory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SubcategoryColumnProps {
  year: number;
  allSubcategories: SubcategorySummary[];
}

function SubcategoryColumn({ year, allSubcategories }: SubcategoryColumnProps) {
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategorySummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setDisplayCount(prev => prev + 10);
    setIsLoading(false);
  };

  const handleSubcategoryClick = (subcategory: SubcategorySummary) => {
    setSelectedSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubcategory(null);
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
    <>
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
              <div 
                key={subcategory.name} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
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
      
      <SubcategoryModal 
        subcategory={selectedSubcategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
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
      <h2 className="text-2xl font-bold text-gray-900">Top Funded Subcategories by Year</h2>
      <p className="text-gray-600 mb-6">Click on each subcategory to see the APPGs within.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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