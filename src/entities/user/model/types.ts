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
  placeWork: string
  role: "student" | "author" | "admin"
  isVerified: boolean
  createdAt: string
  avatar?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
  category: "education" | "publication" | "rating" | "experience" | "other"
}

export interface ProfileStats {
  totalViews: number
  totalLikes: number
  totalPublications: number
  totalCourses: number
  responseTime: string 
}

export interface UpcomingEvent {
  id: string
  title: string
  type: "conference" | "webinar" | "meeting"
  date: string
  location?: string
  isOnline: boolean
}

export interface Contact {
  type: "email" | "phone" | "website" | "vk" | "telegram" | "instagram" | string
  value: string
  label?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
}

export interface Specialization {
  main: string
  additional?: string
  category?: string
}

export interface AuthorProfile extends User {
  position: string // должность
  experience: string // опыт работы
  location: string
  followers: number 
  following: number 
  rating: number // рейтинг ело
  publications: Post[] 
  courses: Course[]
  bio?: string
  specialization?: Specialization
  achievements: Achievement[]
  stats: ProfileStats
  upcomingEvents?: UpcomingEvent[];
  contacts: Contact[]   
  education: Education[]
}
