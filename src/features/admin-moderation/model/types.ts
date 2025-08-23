export interface PendingUser {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  avatarId?: string
  avatar?: string
  defaultAvatarPath?: string
  role: string
  createdAt: string
  pendingChanges: {
    data: {
      [key: string]: {
        value: string
        status: string
      }
    }
    globalStatus: string
    submittedAt: string
  }
}

export interface PendingUsersResponse {
  success: boolean
  data: {
    users: PendingUser[]
    total: number
    page: number
    totalPages: number
  }
}

export interface GetPendingUsersParams {
  page?: number
}

export interface ApproveChangesParams {
  userId: string
  fields?: string[]
}

export interface ApproveSpecificFieldsParams {
  userId: string
  fields: string[]
}

export interface RejectChangesParams {
  userId: string
}

export interface ModerationActionResponse {
  success: boolean
  message: string
}

export interface AdminModerationError {
  status: number
  data: {
    success: boolean
    message: string
  }
}

export interface ApproveSpecificFieldsRequest {
  fieldsToApprove: string[]
}

export interface DocumentFile {
  originalName: string
  size: number
}

export interface PendingDocument {
  userId: string
  userName: string
  document: {
    _id: string
    file: DocumentFile
    category: string
    label?: string
  }
  documentUrl: string
}

export interface PendingDocumentsResponse {
  success: boolean
  data: PendingDocument[]
}

export interface DocumentActionRequest {
  userId: string
  documentId: string
}

export type DocumentCategory =
  | "higher_education_diploma"
  | "residency_diploma"
  | "professional_retraining_diploma"
  | "academic_degree_diploma"
  | "accreditation_certificate"
  | "specialist_certificate"
  | "qualification_certificate"
  | "medical_license"
  | "scientific_publication"
  | "patent"
  | "award"
  | "recommendation_letter"
  | "student_id"
  | "other"
