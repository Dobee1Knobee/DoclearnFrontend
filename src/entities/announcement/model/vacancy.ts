import type { BaseAnnouncement, AnnouncementCategory, Currency } from './base'

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship'

export type WorkFormat = 'office' | 'remote' | 'hybrid'

export interface SalaryRange {
  min?: number
  max?: number
  currency: Currency
  negotiable: boolean
}

export interface VacancyRequirements {
  education: string
  experience: string
  skills: string[]
  certifications?: string[]
  languages?: string[]
}

export interface HiringManager {
  userId?: string
  name: string
  position?: string
  photo?: string
}

export interface Vacancy extends BaseAnnouncement {
  position: string
  department?: string

  employmentType: EmploymentType
  workFormat: WorkFormat

  salary: SalaryRange

  requirements: VacancyRequirements
  responsibilities: string[]
  benefits: string[]

  schedule?: string

  hiringManager: HiringManager

  applicationDeadline?: string

  categories: AnnouncementCategory[]

  urgent: boolean
  featured: boolean
}
