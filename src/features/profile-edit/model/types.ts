import type { Contact, Education, AuthorProfile, StudentProfile } from "@/entities/user/model/types"

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  birthday?: string
  bio?: string
  placeWork?: string
  location?: string
  experience?: string
  specialization?: string
  gpa?: number
  programType?: "Бакалавриат" | "Магистратура" | "Ординатура" | "Аспирантура"
  contacts?: Contact[]
  education?: Education[]
  avatar?: string
  defaultAvatarPath?: string
}

export interface UpdateProfileResponse {
  success: boolean
  data: AuthorProfile | StudentProfile
  moderationFields?: string[]
}

export interface UploadAvatarResponse {
  success: boolean
  data: {
    message: string
    avatarUrl: string
  }
}