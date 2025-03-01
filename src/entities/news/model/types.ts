export interface NewsSource {
    id: string
    name: string
    icon: string
  }
  
  export interface NewsItem {
    id: string
    title: string
    description?: string
    image?: string
    source: NewsSource
    publishedAt: string
  }
  
  