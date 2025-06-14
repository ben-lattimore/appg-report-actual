// Raw data structure matching your JSON files
export interface RawBenefitDetail {
  source: string;
  value_range: string;
  calculated_value: number;
}

export interface RawGroup {
  name: string;
  title: string;
  purpose: string;
  benefits_in_kind: number[];
  total_benefits: number;
  benefits_details: RawBenefitDetail[];
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

export interface YearSummary {
  year: number;
  totalGroups: number;
  totalValue: number;
  groupsWithBenefits: number;
  topGroups: GroupSummary[];
  averageBenefit: number;
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
  overallStats: {
    totalYears: number;
    totalValue: number;
    totalGroups: number;
    mostFundedGroup: GroupSummary;
  };
}