export type AnnouncementStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived'
  | 'moderator_removed'

export type AnnouncementType =
  | "conference"
  | "masterclass"
  | "course"
  | "webinar"
  | "internship"
  | "university"
  | "vacancy"
  | "equipment"

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

export interface Coordinates {
  lat: number
  lng: number
}

export interface AnnouncementLocation {
  type: AnnouncementLocationType
  address?: string
  city?: string
  country?: string
  coordinates?: Coordinates
}

export interface AnnouncementContactInfo {
  email?: string
  phone?: string
  website?: string
}

export interface Speaker {
  userId: string
  name: string
  eventRole: string
  bio?: string
  photo?: string
  status: "pending" | "confirmed" | "declined"
}

export interface BaseAnnouncement {
  type: AnnouncementType
  title: string
  description: string
  organizer: string
  activeFrom: string
  activeTo?: string
  status: AnnouncementStatus
  moderationNotes?: string

  location?: AnnouncementLocation
  contactInfo?: AnnouncementContactInfo

  tags: string[]
  viewsCount: number
  isPromoted: boolean

  createdAt: string
  updatedAt: string
}
