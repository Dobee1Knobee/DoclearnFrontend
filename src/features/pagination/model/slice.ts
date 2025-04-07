import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaginationState } from "./types"

const initialState: PaginationState = {
  currentPage: 1,
  resultsPerPage: 10,
}

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setResultsPerPage: (state, action: PayloadAction<number>) => {
      state.resultsPerPage = action.payload
      state.currentPage = 1 
    },
    resetPagination: (state) => {
      state.currentPage = 1
    },
  },
})

export const { setCurrentPage, setResultsPerPage, resetPagination } = paginationSlice.actions

export default paginationSlice.reducer

