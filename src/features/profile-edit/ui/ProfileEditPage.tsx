"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMyProfileQuery } from "@/features/author-profile/api/authorProfileApi"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { Spinner } from "react-bootstrap"
import { ProfileEditForm } from "./ProfileEditForm"

interface ProfileEditPageProps {
  userId: string
}

export const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ userId }) => {
  const router = useRouter()
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [mounted, setMounted] = useState(false)

  const { data: profile, isLoading, error } = useGetMyProfileQuery()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/")
      return
    }

    if (mounted && currentUser && currentUser._id !== userId) {
      router.push(`/profile/${userId}`)
      return
    }
  }, [mounted, isAuthenticated, currentUser, userId, router])

  if (!mounted || isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" style={{ color: "#5388d8" }} />
        <p className="mt-3">Загрузка...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (currentUser?._id !== userId) {
    return null
  }

  if (error) {
    const errorMessage =
      "data" in error && error.data && typeof error.data === "object" && "message" in error.data
        ? (error.data as any).message
        : "Ошибка загрузки профиля"

    return (
      <div className="text-center p-4">
        <h3 className="text-danger mb-3">{errorMessage}</h3>
        <p className="text-muted">Попробуйте обновить страницу или вернуться позже</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        <h3 className="text-danger mb-3">Профиль не найден</h3>
      </div>
    )
  }
  return <ProfileEditForm profile={profile} />
}
