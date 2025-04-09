import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { FiltersState, DateRange, SortOption } from "./types"

const initialState: FiltersState = {
  dateRange: {
    from: "",
    to: "",
  },
  selectedArticleTypes: [],
  selectedJournals: [],
  sortOption: "relevance",
  filtersApplied: false,
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload
    },
    toggleArticleType: (state, action: PayloadAction<string>) => {
      const typeIndex = state.selectedArticleTypes.indexOf(action.payload)
      if (typeIndex === -1) {
        state.selectedArticleTypes.push(action.payload)
      } else {
        state.selectedArticleTypes.splice(typeIndex, 1)
      }
    },
    toggleJournal: (state, action: PayloadAction<string>) => {
      const journalIndex = state.selectedJournals.indexOf(action.payload)
      if (journalIndex === -1) {
        state.selectedJournals.push(action.payload)
      } else {
        state.selectedJournals.splice(journalIndex, 1)
      }
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload
    },
    applyFilters: (state) => {
      state.filtersApplied = true
    },
    resetFilters: (state) => {
      state.dateRange = { from: "", to: "" }
      state.selectedArticleTypes = []
      state.selectedJournals = []
      state.filtersApplied = false
    },
  },
})

export const { setDateRange, toggleArticleType, toggleJournal, setSortOption, applyFilters, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer

