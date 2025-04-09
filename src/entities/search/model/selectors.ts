import type { RootState } from "@/app/store"

export const selectSearchState = (state: RootState) => state.search
export const selectSearchQuery = (state: RootState) => state.search.query
export const selectSearchResults = (state: RootState) => state.search.results
export const selectSearchLoading = (state: RootState) => state.search.loading
export const selectTotalResults = (state: RootState) => state.search.totalResults
export const selectSearchError = (state: RootState) => state.search.error

