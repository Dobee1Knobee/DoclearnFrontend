export interface PostAuthor {
  id: string
  firstName: string
  lastName: string
  role: string
  isAnonymous: boolean
  avatarUrl?: string
  defaultAvatarPath?: string
}

export interface PostLink {
  url: string
  title: string
  description?: string
  previewImage?: string
}

export interface PostContent {
  text: string
  images: string[]
  links: PostLink[]
}

export interface MedicalTag {
  name: string
  category: "symptom" | "diagnosis" | "treatment" | "specialty" | "other"
}

export interface PostMedical {
  tags: MedicalTag[]
  specialty: string
  isCase: boolean
  difficulty: "beginner" | "intermediate" | "advanced"
}

export interface PostStats {
  likes: number
  comments: number
  shares: number
  views: number
}

export type PostVisibility = "public" | "followers_only" | "private"

export type PostDifficulty = "beginner" | "intermediate" | "advanced"

export type PostSpecialty =
  | "cardiology"
  | "neurology"
  | "oncology"
  | "pediatrics"
  | "surgery"
  | "psychiatry"
  | "radiology"
  | "emergency"
  | "internal_medicine"
  | "dermatology"
  | "orthopedics"
  | "other"

export interface Post {
  id: string
  content: PostContent
  medical: PostMedical
  author: PostAuthor
  stats: PostStats
  visibility: PostVisibility
  createdAt: string
  updatedAt: string
}

export interface PostFeedResponse {
  success: boolean
  data: Post[]
  pagination: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export interface PostSingleResponse {
  success: boolean
  data: Post
}

export interface CreatePostRequest {
  text: string
  images?: string[]
  medicalTags?: MedicalTag[]
  speciality?: string[]
  isCase?: boolean
  difficulty?: PostDifficulty
  visibility?: PostVisibility
  isAnonymous?: boolean
  links?: PostLink[]
}

export interface UpdatePostRequest {
  text?: string
  medicalTags?: MedicalTag[]
  specialty?: string
  difficulty?: PostDifficulty
  visibility?: PostVisibility
}

export interface CreatePostResponse {
  success: boolean
  message: string
  data: Post
}
