import type { BaseAnnouncement } from './base'
import type { AnnouncementCategories, Speaker } from './conference'

export type MasterClassSkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MasterClassInstructor {
  userId: string
  name: string
  bio?: string
  photo?: string
  credentials?: string[]
}

export interface MasterClass extends BaseAnnouncement {
  speakers?: Speaker[]
  instructor: MasterClassInstructor

  skillLevel: MasterClassSkillLevel
  maxParticipants: number
  currentParticipants: number
  price: number;
  currency: 'RUB' | 'USD' | 'EUR'

  materials: string[] // что нужно принести/подготовить
  equipment: string[] // какое оборудование будет предоставлено

  duration: number
  categories: AnnouncementCategories[]
  prerequisites?: string

  certificates: boolean

  // Для практических занятий
  handsOn: boolean
  groupWork: boolean
}
