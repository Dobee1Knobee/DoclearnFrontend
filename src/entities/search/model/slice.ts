import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SearchState } from "./types"
import type { SearchResponse } from "@/entities/article/model/types"

const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
  totalResults: 0,
  error: null,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSearchResults: (state, action: PayloadAction<SearchResponse>) => {
      state.results = action.payload.results
      state.totalResults = action.payload.totalResults
      state.error = null
    },
    setSearchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearSearchResults: (state) => {
      state.results = []
      state.totalResults = 0
      state.error = null
    },
  },
})

export const { setSearchQuery, setLoading, setSearchResults, setSearchError, clearSearchResults } = searchSlice.actions

export default searchSlice.reducer

