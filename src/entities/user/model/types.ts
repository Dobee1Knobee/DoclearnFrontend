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

export interface User {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  birthday: string
  placeWork: string //placeStudy
  role: "student" | "doctor" | "admin"
  isVerified: {
    user: boolean
    doctor: boolean
    student: boolean
  }
  createdAt: string
  avatar?: string
  defaultAvatarPath: string
  avatarUrl?: string
  avatarUrlTimestamp?: number
  location: string
  followers: string[]
  following: string[]
  rating: number
  publications: Post[]
  bio: string
  achievements: Achievement[]
  stats: {
    followingCount: number
    followersCount: number
    postsCount?: number
  }
  contacts: Contact[]   
  education: Education[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  earnedDate: string
  category: "education" | "publication" | "rating" | "experience" | "other"
}

export interface Contact {
  _id: string
  type: string
  label?: string
  value: string
  isPublic?: boolean
}

// export interface Contact1 {
//   // type: "email" | "phone" | "website" | "vk" | "telegram" | "whatsapp" | "facebook" | "twitter" | "instagram" | string
//   type: string
//   value: string
//   label?: string
// }

export interface Education {
  id: string
  institution: string
  degree: string
  specialty: string
  startDate: string
  graduationYear: string
  isCurrently: boolean
}

export interface AuthorProfile extends User {
  experience: string
  courses?: Course[]
  specialization: string
}

export interface StudentProfile extends User {
  coursesEnrolled: Course[]
  gpa?: number // 0-5
  mentorId?: string
  programType: "Бакалавриат" | "Магистратура" | "Ординатура" | "Аспирантура"
}

// export interface UpcomingEvent {
//   id: string
//   title: string
//   type: "conference" | "webinar" | "meeting"
//   date: string
//   location?: string
//   isOnline: boolean
// }