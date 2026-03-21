"use client"

import type React from "react"
import { Suspense } from "react"
import type { SpecialistUser } from "@/entities/user/model/types"
import { useParams, useSearchParams } from "next/navigation"
import { useGetAuthorProfileQuery } from "@/features/author-profile/api/authorProfileApi"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated, selectIsInitialized } from "@/features/auth/model/selectors"
import { ProfileHero } from "./ProfileHero/ProfileHero"
import { ProfileContentRouter } from "./ProfileContentRouter"
import { ProfileSkeleton } from "./ProfileSkeleton/ProfileSkeleton"
import styles from "./ClientProfilePage.module.css"

const ClientProfilePageInner: React.FC = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const userId = params.id as string
  const activeTab = searchParams.get("tab") || "overview"

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
  let error: unknown

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
    return <ProfileSkeleton />
  }

  if (error) {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as { data?: unknown }).data === "object" &&
      (error as { data?: unknown }).data !== null &&
      "message" in ((error as { data?: Record<string, unknown> }).data as Record<string, unknown>)
        ? String(((error as { data?: Record<string, unknown> }).data as Record<string, unknown>).message)
        : "Ошибка загрузки профиля"

    return (
      <div className={styles.stateCard}>
        <h3 className={styles.stateErrorTitle}>{errorMessage}</h3>
        <p className={styles.stateMuted}>Попробуйте обновить страницу или вернуться позже</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.stateCard}>
        <h3 className={styles.stateErrorTitle}>Профиль не найден</h3>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <ProfileHero profile={profile} />
      <ProfileContentRouter profile={profile} activeTab={activeTab} />
    </div>
  )
}

export const ClientProfilePage: React.FC = () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ClientProfilePageInner />
    </Suspense>
  )
}
