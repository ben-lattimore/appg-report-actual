import { getCachedAggregates } from '@/lib/data';
import CategoryFundingColumns from '@/components/CategoryFundingColumns';
import SubcategoryFundingColumns from '@/components/SubcategoryFundingColumns';
import Navigation from '@/components/Navigation';
import PageHeader from '@/components/PageHeader';

export default async function SubcategoryFundingPage() {
  const data = await getCachedAggregates();

  // Transform data to pass allSubcategories to both components
  const yearSummariesWithAllSubcategories = data.yearSummaries.map(year => ({
    year: year.year,
    allSubcategories: year.allSubcategories
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeader 
        title="Category & Subcategory Funding by Year" 
        description="Discover which APPG categories and subcategories receive the most funding each year by aggregating benefits across all groups."
      />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFundingColumns yearSummaries={yearSummariesWithAllSubcategories} />
        <SubcategoryFundingColumns yearSummaries={yearSummariesWithAllSubcategories} />
      </main>
    </div>
  );
}