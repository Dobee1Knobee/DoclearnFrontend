import type { Contact, Education } from "@/entities/user/model/types"

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  middleName?: string
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
  data: {
    message: string
    requiresModeration: boolean
  }
}

export interface UploadAvatarResponse {
  success: boolean
  data: {
    message: string
    avatarUrl: string
  }
}