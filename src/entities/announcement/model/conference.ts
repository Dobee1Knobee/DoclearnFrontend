import type { BaseAnnouncement } from './base';

export interface Speaker {
  userId: string
  name: string
  eventRole: string
  bio?: string
  photo?: string
  status: 'pending' | 'confirmed' | 'declined'
}

export type AnnouncementCategories = 'medical' | 'it' | 'educational' | 'business' | 'science' | 'other'

export type TargetAudience = 'doctors' | 'students' | 'researchers' | 'specialists' | 'general'

export interface Conference extends BaseAnnouncement {
  speakers: Speaker[]
  program?: string
  scheduleUrl?: string

  registrationRequired: boolean
  registrationLink?: string

  maxParticipants?: number
  price_type: 'free' | 'paid'
  currentParticipants: number

  price: number
  currency: 'RUB' | 'USD' | 'EUR'

  categories: AnnouncementCategories[]
  targetAudience: TargetAudience[]
  language: 'ru' | 'en' | 'multi'

  certificates: boolean
  cmeCredits?: number
}
