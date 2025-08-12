import type { Specialization, UserVerification } from "@/entities/user/model/types"

export interface SearchUser {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  role: "student" | "doctor" | "admin" | "resident" | "postgraduate" | "researcher" | "owner"
  specializations: Specialization[]
  defaultAvatarPath: string
  avatarUrl: string | null
  avatarId?: string
  location?: string
  experience?: string
  rating: number
  placeWork: string
  isVerified?: UserVerification
}

export interface SearchResponseData {
  usersWithAvatars: SearchUser[]
  total: number
  query: string
  message: string
}

export interface SearchResponse {
  success: boolean
  data: SearchResponseData
  total: number
}

export interface SearchError {
  error: string
}

export interface SearchState {
  query: string
  results: SearchUser[]
  totalCount: number
  isLoading: boolean
  error: string | null
  selectedIndex: number
  isOpen: boolean
}
