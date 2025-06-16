import type React from "react"

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
  role: "student" | "author"
  isVerified: boolean
  createdAt: string
  avatar?: string
}