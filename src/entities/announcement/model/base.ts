export type AnnouncementStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived'
  | 'moderator_removed'
  | 'deleted'

export type AnnouncementType =
  | "Conference"
  | "Masterclass"
  | "Course"
  | "Webinar"
  | "Internship"
  | "University"
  | "Vacancy"
  | "Equipment"
  | "Olimpiad"


export type AnnouncementCategory =
  | 'medical'
  | 'it'
  | 'educational'
  | 'business'
  | 'science'
  | 'other'

export type TargetAudience =
  | 'doctors'
  | 'students'
  | 'researchers'
  | 'specialists'
  | 'general'

export type AnnouncementLocationType = 'online' | 'offline' | 'hybrid'

export type Currency = 'RUB' | 'USD' | 'EUR'

export type PriceType = 'free' | 'paid'

export type Language = "ru" | "en" | "multi"

export interface AnnouncementLocation {
  address?: string
  city?: string
}

export interface AnnouncementContactInfo {
  email?: string
  phone?: string
  website?: string
}

export interface Speaker {
  userId: string
  name: string
  bio?: string
  eventRole: string
  status: "pending" | "confirmed" | "declined"
}

export interface CustomSpeaker {
  name: string
  role: string
  status: "pending" | "confirmed" | "declined"
}

export interface ConferenceStage {
  id: string
  name: string
  description?: string
  date: string
  maxParticipants?: number
  order: number
}

export interface BaseAnnouncement {
  id: string
  type: AnnouncementType
  title: string
  description: string
  organizerName: string
  organizerId: string
  activeFrom: string
  activeTo?: string
  status: AnnouncementStatus
  moderationNotes?: string

  location?: AnnouncementLocation
  contactInfo?: AnnouncementContactInfo

  tags: string[]
  viewsCount?: number
  isPromoted: boolean

  createdAt: string
  updatedAt: string

  previewImage?: string
}
