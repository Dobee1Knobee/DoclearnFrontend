export interface SearchUser {
  _id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  role: "student" | "doctor" | "admin"
  specialization: string
  defaultAvatarPath: string
  avatarUrl: string | null
  location: string
  experience: string
  rating: number
  placeWork: string
  isVerified: {
    user: boolean
    doctor: boolean
    student: boolean
  }
}

export interface SearchResponse {
  success: boolean
  data: SearchUser[]
  count: number
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
