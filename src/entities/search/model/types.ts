import type { Article } from "@/entities/article/model/types"

export interface SearchState {
  query: string
  results: Article[]
  loading: boolean
  totalResults: number
  error: string | null
}

