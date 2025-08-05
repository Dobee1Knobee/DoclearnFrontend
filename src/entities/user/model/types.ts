import type React from "react"
import type { Post } from "@/entities/post/model/types"
import type { Course } from "@/entities/course/model/types"

export interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
}

export interface UserProfile {
  name: string
  role: string
  avatar: string
}

//типы для научного статуса
export type AcademicDegree = "Нет" | "Кандидат медицинских наук" | "Доктор медицинских наук"
export type AcademicTitle = "Нет" | "Доцент" | "Профессор"
export type AcademicRank = "Нет" | "Член-корреспондент РАН" | "Академик РАН"

export interface ScientificStatus {
  degree: AcademicDegree
  title: AcademicTitle
  rank: AcademicRank
  interests: string[]
}

//типы для специализаций врача
export type SpecializationMethod = "Ординатура" | "Профессиональная переподготовка"
export type QualificationCategory = "Вторая категория" | "Первая категория" | "Высшая категория"

export interface Specialization {
  id: string
  name: string
  method: SpecializationMethod
  qualificationCategory: QualificationCategory
}

//тип для места работы
export interface Work {
  id: string
  organizationId?: string
  organizationName: string
  position: string
  startDate: string
  endDate?: string
  isCurrently: boolean
}

export interface Contact {
  _id: string
  type: string
  label?: string
  value: string
  isPublic?: boolean
}

export interface Education {
  _id: string
  institution: string
  degree: string
  specialty: string
  startDate: string
  graduationYear: string
  isCurrently: boolean
}

// export interface StudentEducation extends BaseEducation {
//   degree: "Специалитет"
// }

// export interface GeneralEducation extends BaseEducation {
//   degree: string
// }

//тип верификации с новыми ролями
export interface UserVerification {
  user: boolean
  doctor: boolean
  student: boolean
  resident: boolean // ординатор
  postgraduate: boolean // аспирант
  researcher: boolean // научный сотрудник
}

export interface UserStats {
  followingCount: number
  followersCount: number
  postsCount?: number
}

export interface AvatarFile {
  _id: string
  fileName: string
  originalName: string
  fileType: string
  size: number
  mimetype: string
  userId: string
  uploadedAt: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type DocumentCategory = "diploma" | "certificate" | "license" | "id" | "other"

export interface Document {
  _id: string
  file: string
  category: DocumentCategory
  label?: string
  isPublic: boolean
  uploadedAt: string
}

export interface BaseUserFields {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  birthday: string
  placeStudy: string // место учебы, новое поле 
  placeWork: string
  workHistory: Work[] // история мест работы, новое поле
  mainSpecialization: string // новое поле для основной специализации
  isVerified: UserVerification
  createdAt: string
  avatar?: string
  defaultAvatarPath: string
  avatarUrl?: string
  avatarUrlTimestamp?: number
  avatarId?: AvatarFile
  location: string
  followers: string[]
  following: string[]
  rating: number
  publications: Post[]
  bio: string
  achievements: Achievement[]
  stats: UserStats
  contacts: Contact[]
  documents: Document[]
  experience: string // общее поле для всех ролей
}

// Студент
export interface StudentUser extends BaseUserFields {
  role: "student"
  mentorId?: string
  coursesEnrolled?: Course[]
  education: Education

}

// Ординатор
export interface ResidentUser extends Omit<StudentUser, "role" | "education"> {
  role: "resident"
  education: Education[]
}

// Аспирант
export interface PostgraduateUser extends Omit<ResidentUser, "role"> {
  role: "postgraduate"
  scientificStatus: ScientificStatus
}

// Врач
export interface DoctorUser extends Omit<PostgraduateUser, "role"> {
  role: "doctor"
  specializations: Specialization[]
}

// Научный сотрудник
export interface ResearcherUser extends Omit<DoctorUser, "role"> {
  role: "researcher"
}

// Админ
export interface AdminUser extends BaseUserFields {
  role: "admin"
  education: Education[]
  scientificStatus?: ScientificStatus
  specializations?: Specialization[]
}

export interface OwnerUser extends BaseUserFields {
  role: "owner"
  education: Education[]
  scientificStatus?: ScientificStatus
  specializations?: Specialization[]
}

// Union type для всех типов пользователей-специалистов
export type SpecialistUser = StudentUser | ResidentUser | PostgraduateUser | DoctorUser | ResearcherUser | AdminUser | OwnerUser

export type SpecialistRole = "student" | "resident" | "postgraduate" | "doctor" | "researcher" | "admin" | "owner"

export interface Achievement {
  id: string
  title: string
  description: string
  earnedDate: string
  category: "education" | "publication" | "rating" | "experience" | "other"
}
