export type AnnouncementStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived'
  | 'moderator_removed'

export type AnnouncementLocationType = 'online' | 'offline' | 'hybrid'

export interface AnnouncementLocation {
  type: AnnouncementLocationType
  address?: string
  city?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface AnnouncementContactInfo {
  email?: string
  phone?: string
  website?: string
}

export interface BaseAnnouncement {
  title: string
  description: string
  organizer: string
  activeFrom: string
  activeTo?: string
  status: AnnouncementStatus
  moderationNotes?: string
  type: string

  location?: AnnouncementLocation
  contactInfo?: AnnouncementContactInfo

  tags: string[]
  viewsCount: number
  isPromoted: boolean

  createdAt: string
  updatedAt: string
}
