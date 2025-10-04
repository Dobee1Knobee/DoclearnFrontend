export interface ConferenceStage {
  id: string
  name: string
  date: string
  maxParticipants?: number
  order: number
}

export interface ConferenceApplication {
  id: string
  conferenceId: string
  participantName: string
  participantEmail: string
  talkTitle: string
  abstract: string
  attachedFiles: AttachedFile[]
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}

export interface AttachedFile {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface ConferenceParticipant {
  id: string
  conferenceId: string
  applicationId: string
  participantName: string
  participantEmail: string
  talkTitle: string
  currentStageId?: string
  isWinner: boolean
  approvedAt: string
}

export interface ConferenceWithManagement {
  id: string
  title: string
  description: string
  organizerName: string
  activeFrom: string
  activeTo?: string
  status: string
  location?: {
    address?: string
    city?: string
  }
  format: "online" | "offline" | "hybrid"
  maxParticipants?: number
  currentParticipants: number
  stages?: ConferenceStage[]
  applications: ConferenceApplication[]
  participants: ConferenceParticipant[]
  previewImage?: string
}
