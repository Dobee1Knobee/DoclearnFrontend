import type { SpecialistUser } from "@/entities/user/model/types"

export interface AdminUsersResponse {
  success: boolean
  data: {
    users: SpecialistUser[]
    total: number
    page: number
    totalPages: number
  }
}

export interface GetAdminUsersParams {
  page?: number
}

export interface AdminUsersError {
  status: number
  data: {
    success: boolean
    message: string
  }
}
