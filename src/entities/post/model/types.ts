export interface PostAuthor {
    id: string
    name: string
    avatar: string
    isVerified: boolean
  }
  
  export interface PostContent {
    text: string
    images?: string[]
    links?: {
      url: string
      title: string
    }[]
  }
  
  export interface PostStats {
    likes: number
    comments: number
    shares: number
    isLiked: boolean
    isSaved: boolean
  }
  
  export interface Post {
    id: string
    author: PostAuthor
    content: PostContent
    createdAt: string
    stats: PostStats
  }
  
  