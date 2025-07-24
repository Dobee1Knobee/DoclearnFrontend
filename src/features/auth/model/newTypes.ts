  import type { Contact, UserStats, SpecialistRole } from "@/entities/user/model/newTypes"
  import type { OrganizationResponsiblePerson } from "@/entities/organization/model/types"

  export type AccountType = "specialist" | "organization"

  export interface RegisterSpecialistDto {
    role: "student"
    firstName: string
    lastName: string
    middleName?: string
    email: string
    password: string
    birthday: string
    placeStudy: string // новое
    placeWork?: string // теперь необязательное
    defaultAvatarPath: string
  }

  export interface RegisterOrganizationDto {
    role: "organization"
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

  export interface LoginDto {
    email: string
    password: string
  }

  export interface VerifyDto {
    email: string
    code: string
  }

  export interface RegistrationFormState {
    accountType: AccountType // переключатель между специалист/организация
    specialistData: Partial<RegisterSpecialistDto>
    organizationData: Partial<RegisterOrganizationDto>
    isLoading: boolean
    error: string | null
  }

  // Упрощенное начальное состояние формы регистрации
  export const initialRegistrationState: RegistrationFormState = {
    accountType: "specialist", // по умолчанию специалист
    specialistData: {
      role: "student"
    },
    organizationData: {
      role: "organization",
    },
    isLoading: false,
    error: null,
  }

  // Типы для валидации форм
  export interface ValidationError {
    field: string
    message: string
  }

  export interface FormValidationResult {
    isValid: boolean
    errors: ValidationError[]
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
}
