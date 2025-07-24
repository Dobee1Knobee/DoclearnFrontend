import type { Contact } from "@/entities/user/model/types"

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  password: string
  birthday: string
  placeWork: string
  role: "student" | "doctor"
  defaultAvatarPath: string
}

export interface VerifyDto {
  email: string
  code: string
}

export interface UpdateUserFieldsPayload {
  defaultAvatarPath?: string
  location?: string
  birthday?: string
  bio?: string
  contacts?: Contact[]
  experience?: string 
  programType?: "Бакалавриат" | "Магистратура" | "Ординатура" | "Аспирантура"
  stats?: {
    followingCount: number
    followersCount: number
    postsCount?: number
  }
}


