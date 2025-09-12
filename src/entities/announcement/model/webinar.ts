import type { BaseAnnouncement, Speaker, AnnouncementCategory, TargetAudience, Currency, Language, PriceType } from './base'

export type WebinarPlatform = 'zoom' | 'teams' | 'youtube' | 'google_meet' | 'yandex' | 'other';

export interface WebinarPlatformDetails {
  meetingId?: string
  password?: string
  joinUrl?: string
}

export interface Webinar extends BaseAnnouncement {
  speakers: Speaker[]

  platform: WebinarPlatform
  platformDetails?: WebinarPlatformDetails

  isRecorded: boolean
  recordingLink?: string
  recordingAvailableUntil?: string

  participantLimit?: number
  registrationLink?: string

  price: number
  price_type: PriceType
  currency: Currency

  categories: AnnouncementCategory[]
  targetAudience: TargetAudience[]
  language: Language

  duration: number
  prerequisites?: string
  materials?: string[]
}
