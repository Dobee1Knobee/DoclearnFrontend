import type { Contact, Education, AuthorProfile } from "@/entities/user/model/types"

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  birthday?: string
  bio?: string
  placeWork?: string
  location?: string
  experience?: string
  specialization?: string
  contacts?: Contact[]
  education?: Education[]
  avatar?: string
}

export interface UpdateProfileResponse {
  success: boolean
  data: AuthorProfile 
  moderationFields?: string[]
}
