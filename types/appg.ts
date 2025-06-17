// Raw data structure matching your JSON files
export interface RawBenefitDetail {
  source: string;
  value_range: string;
  calculated_value: number;
}

export interface ThemeCategory {
  name: string;
  subcategories: string[];
}

export interface APPGCategorization {
  categories: {
    category: string;
    subcategories: string[];
  }[];
}

export interface RawGroup {
  name: string;
  title: string;
  purpose: string;
  benefits_in_kind: number[];
  total_benefits: number;
  benefits_details: RawBenefitDetail[];
  // Add categorization field
  categorization?: APPGCategorization;
}

export interface RawYearFile {
  source_file: string;
  publication_date: string;
  extraction_date: string;
  total_groups: number;
  total_benefits_value: number;
  appg_groups: RawGroup[];
}

// Transformed data for UI consumption
export interface GroupSummary {
  name: string;
  title: string;
  total: number;
  benefitCount: number;
}

// New funder-related interfaces
export interface FunderAPPG {
  name: string;
  title: string;
  amount: number;
}

export interface FunderSummary {
  name: string;
  totalAmount: number;
  appgCount: number;
  appgs: FunderAPPG[];
}

export interface YearFunderSummary {
  year: number;
  topFunders: FunderSummary[];
}

// NEW: Subcategory funding interfaces
export interface SubcategoryAPPG {
  name: string;
  title: string;
  amount: number;
}

export interface SubcategorySummary {
  name: string;
  category: string;
  totalAmount: number;
  appgCount: number;
  appgs: SubcategoryAPPG[];
}

export interface YearSubcategorySummary {
  year: number;
  topSubcategories: SubcategorySummary[];
  allSubcategories: SubcategorySummary[];
}

export interface YearSummary {
  year: number;
  totalGroups: number;
  totalValue: number;
  groupsWithBenefits: number;
  allGroups: GroupSummary[];
  averageBenefit: number;
  allFunders: FunderSummary[];
  // NEW: Add subcategory data
  topSubcategories: SubcategorySummary[];
  allSubcategories: SubcategorySummary[];
}

export interface GroupComparison {
  name: string;
  title: string;
  yearlyData: {
    year: number;
    total: number;
    benefitCount: number;
  }[];
  totalAcrossYears: number;
  averagePerYear: number;
}

export interface AggregatedData {
  yearSummaries: YearSummary[];
  groupComparisons: GroupComparison[];
  yearFunderSummaries: YearFunderSummary[];
  // NEW: Add subcategory summaries
  yearSubcategorySummaries: YearSubcategorySummary[];
  overallStats: {
    totalYears: number;
    totalValue: number;
    totalGroups: number;
    mostFundedGroup: GroupSummary;
  };
}