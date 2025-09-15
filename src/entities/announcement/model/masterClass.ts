import type { BaseAnnouncement, AnnouncementCategory, Speaker, Currency, PriceType } from './base'

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
  price_type: PriceType
  currency: Currency

  materials: string[]
  equipment: string[] // какое оборудование будет предоставлено

  registrationLink?: string

  duration: number
  categories: AnnouncementCategory[]
  prerequisites?: string

  certificates: boolean

  // Для практических занятий
  handsOn: boolean
  groupWork: boolean
}
