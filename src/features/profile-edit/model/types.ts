import type { Contact, Education, SpecialistRole } from "@/entities/user/model/types"
import { Specialization } from "@/shared/data/specializations"

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
  contacts?: Contact[]
  education?: Education[]
  role?: SpecialistRole
  placeStudy?: string
  defaultAvatarPath?: string
  specializations?: Specialization[]
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
    avatarId: string
  }
}