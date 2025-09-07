import type { BaseAnnouncement } from './base'
import type { Speaker, AnnouncementCategories } from './conference'

export interface CourseModule {
  title: string
  description?: string
  duration: number // в часах
  materials?: string[]
}

export type CourseFormat = 'online' | 'offline' | 'hybrid'
export type CourseSkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface CourseSchedule {
  startDate: string
  endDate: string
  sessionsPerWeek?: number
  sessionDuration?: number // в часах
}

export interface Course extends BaseAnnouncement {
  instructors: Speaker[]

  modules: CourseModule[]
  totalHours: number

  accredited: boolean
  accreditationBody?: string
  credits?: number

  skillLevel: CourseSkillLevel
  maxParticipants: number
  currentParticipants: number

  price: number
  currency: 'RUB' | 'USD' | 'EUR'

  format: CourseFormat
  schedule: CourseSchedule

  prerequisites: string[]
  targetAudience: string[]
  categories: AnnouncementCategories[]

  certificates: boolean
  diploma: boolean

  assessments: boolean // есть ли тестирования/экзамены
  practicalWork: boolean
}
