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
  type: {
    type: string
    label?: string
  }
  value: string
  isPublic?: boolean
}

export interface Education {
  id?: string
  institution: string
  degree: string
  startDate: string
  specialty: string  
  graduationYear: string
  isCurrently: boolean
}

export interface AuthorProfile extends User {
  experience: string
  courses?: Course[]
  specialization: string
}
