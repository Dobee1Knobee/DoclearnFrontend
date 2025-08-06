import type { OrganizationResponsiblePerson } from "@/entities/organization/model/types"
import type { SpecialistRole, UserStats, Contact, Education } from "@/entities/user/model/types"

export type AccountType = "specialist" | "organization"

export interface RegisterSpecialistDto {
  role: "student"
  firstName: string
  lastName: string
  middleName?: string
  email: string
  password: string
  birthday: string
  placeStudy: string
  placeWork?: string 
  defaultAvatarPath: string
}

export interface RegisterOrganizationDto {
  role: "organization"
  email: string
  fullName: string
  description?: string

  // Юридические данные
  legalForm: string
  ogrn: string
  inn: string
  kpp: string

  // Контактная информация
  legalAddress: string
  address: string
  notificationEmail: string
  workPhone: string
  website?: string
  responsiblePerson: OrganizationResponsiblePerson
  password: string
}

export type RegisterDto = RegisterSpecialistDto | RegisterOrganizationDto

export interface RegistrationFormState {
  accountType: AccountType 
  specialistData: Partial<RegisterSpecialistDto>
  organizationData: Partial<RegisterOrganizationDto>
  isLoading: boolean
  error: string | null
}

export const initialRegistrationState: RegistrationFormState = {
  accountType: "specialist",
  specialistData: {
    role: "student",
  },
  organizationData: {
    role: "organization",
  },
  isLoading: false,
  error: null,
}

export interface LoginDto {
  email: string
  password: string
}

export interface VerifyDto {
  email: string
  code: string
}

export interface UpdateSpecialistFieldsPayload {
  defaultAvatarPath?: string
  location?: string
  birthday?: string
  bio?: string
  contacts?: Contact[]
  experience?: string
  stats?: Partial<UserStats>
  placeStudy?: string
  placeWork?: string
  role?: SpecialistRole
  education?: Education | Education[]
}


