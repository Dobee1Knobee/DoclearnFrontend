"use client"

import type React from "react"
import { useState } from "react"
import { useAppSelector } from "@/shared/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { useRouter } from "next/navigation"
import type { AuthorProfile } from "@/entities/user/model/types"
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
  profile: AuthorProfile
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
    specialization,
    location,
    experience,
    placeWork,
    rating,
    isVerified,
    stats,
  } = profile

  const fullName = `${firstName} ${lastName}`

  const specText = specialization || "Специализация не указана"

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
          <img src={avatar || "/Avatars/Avatar1.jpg"} alt={fullName} className={styles.avatar} />
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
            {experience && (
              <div className={styles.metaItem}>
                <Briefcase size={16} className={styles.metaIcon} />
                <span className={`${styles.metaText} ${styles.metaTextExperience}`} title={experience}>
                  {experience}
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
              <div className={styles.tooltipText}>Рейтинг врачей пока в разработке</div>
            </div>
          </div>
          
          <div className={styles.actions}>{renderActionButton()}</div>
          {/* <div className={styles.actions}>
            <button className={styles.secondaryButton} onClick={() => router.push(`/profile/${_id}/edit`)}> 
              Редактировать
            </button>
             <button className={styles.primaryButton} onClick={() => {}}>
              Подписаться
            </button> 
          </div> */}
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
