export interface Article {
  id: string
  title: string
  authors: string[]
  journal?: string
  publishedDate?: string
  abstract?: string
  doi?: string
  citations?: number
  keywords?: string[]
  type?: string
  url?: string
  fullText?: string
  views?: number
  downloads?: number
  altmetricScore?: number
  publisher?: string
  pages?: string
}

export interface SearchResponse {
  results: Article[]
  totalResults: number
}
