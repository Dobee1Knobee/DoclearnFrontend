import { configureStore } from "@reduxjs/toolkit"
import searchReducer from "@/entities/search/model/slice"
import filtersReducer from "@/features/article-filters/model/slice"
import paginationReducer from "@/features/pagination/model/slice"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
    pagination: paginationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

