import type { BaseAnnouncement } from './base'
import type { Speaker, AnnouncementCategories, TargetAudience } from './conference'

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
  currency: 'RUB' | 'USD' | 'EUR'

  categories: AnnouncementCategories[]
  targetAudience: TargetAudience[]
  language: 'ru' | 'en' | 'multi'

  duration: number
  prerequisites?: string
  materials?: string[]
}
