import type { RootState } from "@/app/store"

export const selectFiltersState = (state: RootState) => state.filters
export const selectDateRange = (state: RootState) => state.filters.dateRange
export const selectSelectedArticleTypes = (state: RootState) => state.filters.selectedArticleTypes
export const selectSelectedJournals = (state: RootState) => state.filters.selectedJournals
export const selectSortOption = (state: RootState) => state.filters.sortOption
export const selectFiltersApplied = (state: RootState) => state.filters.filtersApplied

