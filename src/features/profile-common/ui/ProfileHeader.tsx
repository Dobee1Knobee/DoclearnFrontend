"use client"

import type React from "react"
import { useState } from "react"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
} from "@/features/profile-edit/api/profileEditApi"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"
import { MapPin, GraduationCap, Briefcase } from "lucide-react"
import styles from "./ProfileHeader.module.css"

interface ProfileHeaderProps {
  profile: AuthorProfile | StudentProfile
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {

  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const router = useRouter()

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()

  const isOwnProfile = currentUser?._id === profile._id
  const shouldCheckFollowStatus = isAuthenticated && !isOwnProfile

  const { data: followStatusData, refetch: refetchFollowStatus } = useCheckFollowStatusQuery(profile._id, {
    skip: !shouldCheckFollowStatus,
  })

  const isFollowing = followStatusData?.data?.isFollowing || false

  const {
    _id,
    avatar,
    firstName,
    lastName,
    location,
    placeWork,
    rating,
    isVerified,
    stats,
  } = profile

  const fullName = `${firstName} ${lastName}`

  const getSpecializationText = () => {
    if (profile.role === "student") {
      const studentProfile = profile as StudentProfile
      return studentProfile.programType || "Программа не указана"
    } else {
      const authorProfile = profile as AuthorProfile
      return authorProfile.specialization || "Специализация не указана"
    }
  }

  const getExperienceText = () => {
    if (profile.role === "student") {
      const studentProfile = profile as StudentProfile
      return studentProfile.gpa !== undefined ? `GPA: ${studentProfile.gpa.toFixed(2)}` : "GPA: Не указано"
    } else {
      const authorProfile = profile as AuthorProfile
      return authorProfile.experience || null
    }
  }

  const specText = getSpecializationText()
  const experienceText = getExperienceText()

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      if (isFollowing) {
        const result = await unfollowUser(_id).unwrap()
        console.log("Отписка успешна:", result.message)
      } else {
        const result = await followUser(_id).unwrap()
        console.log("Подписка успешна:", result.message)
      }

      refetchFollowStatus()
    } catch (error: any) {
      console.error("Ошибка при изменении подписки:", error)
    }
  }

  const handleLoginSuccess = (userId: string) => {
    setShowLoginModal(false)
    window.location.reload()
  }

  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <button className={styles.primaryButton} onClick={() => setShowLoginModal(true)}>
          Подписаться
        </button>
      )
    }

    if (isOwnProfile) {
      return (
        <button className={styles.secondaryButton} onClick={() => router.push(`/profile/${_id}/edit`)}>
          Редактировать
        </button>
      )
    }

    return (
      <button className={isFollowing ? styles.secondaryButton : styles.primaryButton} onClick={handleFollowToggle}>
        {isFollowing ? "Отписаться" : "Подписаться"}
      </button>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Image
            src={avatar || "/Avatars/Avatar1.webp"}
            alt={fullName}
            width={120} 
            height={120} 
            className={styles.avatar}
            priority={true}
          />
        </div>
        <div className={styles.center}>
          <h1 className={styles.name}>
            {fullName} 
            {isVerified?.doctor && <VerifiedBadge className={styles.verifiedIcon} />} 
          </h1>
          {specText && <div className={styles.specialization}>{specText}</div>}
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <MapPin size={16} className={styles.metaIcon} />
              <span className={`${styles.metaText} ${styles.metaTextLocation}`} title={location || "Не указано"}>
                {location || "Не указано"}
              </span>
            </div>
            {experienceText && (
              <div className={styles.metaItem}>
                <Briefcase size={16} className={styles.metaIcon} />
                <span className={`${styles.metaText} ${styles.metaTextExperience}`} title={experienceText}>
                  {experienceText}
                </span>
              </div>
            )}
            <div className={styles.metaItem}>
              <GraduationCap size={16} className={styles.metaIcon} />
              <span className={`${styles.metaText} ${styles.metaTextWork}`} title={placeWork || "Не указано"}>
                {placeWork || "Не указано"}
              </span>
            </div>
          </div>
        </div>
          <div className={styles.statsBlock}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stats?.followersCount || 0}</span>
              <span className={styles.statLabel}>Подписчики</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{stats?.followingCount || 0}</span>
              <span className={styles.statLabel}>Подписки</span>
            </div>
            <div className={`${styles.stat} ${styles.tooltipWrapper}`}>
              <span className={styles.statValueBlue}>{rating || 0}</span>
              <span className={styles.statLabel}>ELO рейтинг</span>
              <div className={styles.tooltipText}>{profile.role === "student" ? "Рейтинг студентов пока в разработке" : "Рейтинг врачей пока в разработке"}</div>
            </div>
          </div>
          
          <div className={styles.actions}>{renderActionButton()}</div>
      </div>
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        switchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
        onSuccess={handleLoginSuccess}
      />

      <RegistrationModal
        show={showRegisterModal}
        handleClose={() => setShowRegisterModal(false)}
        switchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
