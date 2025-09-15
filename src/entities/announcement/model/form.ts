import type { BaseAnnouncement, AnnouncementType, AnnouncementLocation, AnnouncementContactInfo, AnnouncementCategory, TargetAudience, Speaker, Language, PriceType, Currency } from "./base"
import type { MasterClassSkillLevel } from "./masterClass"


export interface CreateAnnouncementFormData {
  category: AnnouncementType | null

  title: string
  organizer: string
  activeFrom: string
  activeTo: string
  startTime: string
  endTime: string
  location: AnnouncementLocation
  maxParticipants: number | null
  participantLimit: number | null
  price_type: PriceType
  price: number
  currency: Currency
  program: string
  speakers: Speaker[]
  certificates: boolean
  registrationRequired: boolean
  registrationLink: string
  contactInfo: AnnouncementContactInfo

  skillLevel?: MasterClassSkillLevel
  materials?: string[]
  duration?: number
  equipment?: string[]
  handsOn?: boolean
  groupWork?: boolean

  isRecorded?: boolean
  recordingLink?: string
  recordingAvailableUntil?: string
  platform?: string
  prerequisites?: string

  // Дополнительные детали
  description: string
  categories: AnnouncementCategory[]
  targetAudience: TargetAudience[]
  language: Language
  tags: string[]

  // Предпросмотр
  isPromoted: boolean
}
