export type SortOption = "relevance" | "date_desc" | "date_asc" | "citations"

export interface DateRange {
  from: string
  to: string
}

export interface FiltersState {
  dateRange: DateRange
  selectedArticleTypes: string[]
  selectedJournals: string[]
  sortOption: SortOption
  filtersApplied: boolean
}

