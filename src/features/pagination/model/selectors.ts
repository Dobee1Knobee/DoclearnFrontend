import type { RootState } from "@/app/store"

export const selectPaginationState = (state: RootState) => state.pagination
export const selectCurrentPage = (state: RootState) => state.pagination.currentPage
export const selectResultsPerPage = (state: RootState) => state.pagination.resultsPerPage

