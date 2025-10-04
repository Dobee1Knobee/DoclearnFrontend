import type { BaseAnnouncement, AnnouncementCategory, Currency } from './base';

export interface InternshipSupervisor {
  userId: string
  name: string
  position: string
  photo?: string
}

export interface InternshipDuration {
  months: number
  startDate: string
  endDate: string
}

export interface InternshipRequirements {
  education: string
  experience?: string
  skills: string[]
  languages?: string[]
}

export interface Internship extends BaseAnnouncement {
  department: string
  supervisor: InternshipSupervisor

  duration: InternshipDuration

  requirements: InternshipRequirements
  responsibilities: string[]
  benefits: string[]

  isPaid: boolean
  stipend?: number
  currency?: Currency

  maxInterns: number
  currentInterns: number

  applicationDeadline: string

  remote: boolean
  partTime: boolean

  categories: AnnouncementCategory[]
}
