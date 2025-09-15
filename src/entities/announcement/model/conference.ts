import type { BaseAnnouncement, Speaker, AnnouncementCategory, TargetAudience, Currency, Language, PriceType } from './base';

export interface Conference extends BaseAnnouncement {
  speakers: Speaker[]
  program?: string
  scheduleUrl?: string

  registrationRequired: boolean
  registrationLink?: string

  maxParticipants?: number
  price_type: PriceType
  currentParticipants: number

  price: number
  currency: Currency

  categories: AnnouncementCategory[]
  targetAudience: TargetAudience[]
  language: Language

  certificates: boolean
  cmeCredits?: number
}
