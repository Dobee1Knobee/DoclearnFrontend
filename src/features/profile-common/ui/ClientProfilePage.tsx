"use client"

import type React from "react"
import type { SpecialistUser } from "@/entities/user/model/types"
import { useParams } from "next/navigation"
import { useGetAuthorProfileQuery } from "@/features/author-profile/api/authorProfileApi"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated, selectIsInitialized } from "@/features/auth/model/selectors"
import { Spinner } from "react-bootstrap"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileTabs } from "./ProfileTabs"

export const ClientProfilePage: React.FC = () => {
  const params = useParams()
  const userId = params.id as string

  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isInitialized = useAppSelector(selectIsInitialized)

  const isOwnProfile = isInitialized && isAuthenticated && currentUser?._id === userId

  const {
    data: otherProfile,
    isLoading: isOtherProfileLoading,
    error: otherProfileError,
  } = useGetAuthorProfileQuery(userId, {
    skip: !isInitialized || isOwnProfile,
  })

  let profile: SpecialistUser | undefined
  let isLoading: boolean
  let error: any

  if (!isInitialized) {
    isLoading = true
    error = undefined
    profile = undefined
  } else if (isOwnProfile) {
    isLoading = false
    error = undefined
    profile = currentUser as SpecialistUser
  } else {
    isLoading = isOtherProfileLoading
    error = otherProfileError
    profile = otherProfile as SpecialistUser
  }

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" style={{ color: "#5388d8" }} />
        <p className="mt-3">Загрузка профиля...</p>
      </div>
    )
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

  return (
    <>
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </>
  )
}
