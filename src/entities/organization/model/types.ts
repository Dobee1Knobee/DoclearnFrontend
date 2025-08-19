import type { Post } from "@/entities/post/model/types"
import type { Course } from "@/entities/course/model/types"

// Типы организаций
export type OrganizationType =
  | "clinic"
  | "hospital"
  | "medical_center"
  | "polyclinic"
  | "research_institute"
  | "university"
  | "medical_school"
  | "laboratory"
  | "diagnostic_center"
  | "rehabilitation_center"

export interface OrganizationVerification {
  organization: boolean
  partner: boolean
}

// Специалисты
export interface OrganizationSpecialist {
  userId: string
  role: string // "Главный врач", "Заведующий отделением", "Врач", "Медсестра" и т.д.
  department?: string // Отделение
  joinedAt: string
  isActive: boolean
}

// Контактная информация
export interface Contact {
  _id: string
  type: string
  label?: string
  value: string
  isPublic?: boolean
}

// Ответственное лицо организации
export interface OrganizationResponsiblePerson {
  fullName: string
  position: string
  email: string
}

export interface OrganizationAchievement {
  id: string
  title: string
  description?: string
  year: string
  category: "award" | "certification" | "other"
}

// Статистика организации
export interface OrganizationStats {
  followersCount: number
  specialistsCount: number
  rating: number // ELO рейтинг организации
  postsCount: number
  coursesCount: number
}

export interface OrganizationLegalInfo {
  inn: string
  ogrn: string
  license: string
}

export interface Organization {
  organizationId: string
  role: "organization"
  fullName: string
  type: OrganizationType
  description?: string
  avatarId?: string
  avatarUrl?: string
  defaultAvatarPath: string
  contacts: Contact[]
  followers: string[]
  following: string[]
  createdAt: string
  isVerified: OrganizationVerification
  stats: OrganizationStats

  // Фактический адрес
  address?: string

  // Данные ответственного лица
  responsiblePerson: OrganizationResponsiblePerson

  // Юридическая информация
  legalInfo: OrganizationLegalInfo

  // Медицинская деятельность
  medicalDirections: string[] // Основные направления(Кардиология, Хирургия,Диагностика)

  // Специалисты
  specialists: OrganizationSpecialist[]

  publications: Post[]
  courses: Course[]
  achievements: OrganizationAchievement[]
}

export type AccountType = "specialist" | "organization"
