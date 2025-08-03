"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { updateUserFields } from "@/features/auth/model/slice"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { SpecialistUser } from "@/entities/user/model/types"
import { VerifiedStatusIcons } from "@/shared/ui/VerifiedStatusIcons/VerifiedStatusIcons"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
} from "@/features/profile-edit/api/profileEditApi"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import NewRegistrationModal from "@/features/auth/ui/Registration/NewRegistrationModal"
import { MapPin, GraduationCap, Briefcase } from "lucide-react"
import styles from "./ProfileHeader.module.css"
import { Spinner } from "react-bootstrap"
import { ContactsModal } from "./ContactsModal/ContactsModal"

interface ProfileHeaderProps {
  profile: SpecialistUser
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { getAvatarUrl } = useAvatarCache()

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showContactsModal, setShowContactsModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowLoading }] = useUnfollowUserMutation()

  const [localFollowersCount, setLocalFollowersCount] = useState<number | null>(null)

  const isOwnProfile = currentUser?._id === profile._id
  const shouldCheckFollowStatus = isAuthenticated && !isOwnProfile

  const { data: followStatusData, refetch: refetchFollowStatus } = useCheckFollowStatusQuery(profile._id, {
    skip: !shouldCheckFollowStatus,
  })

  const isFollowing = followStatusData?.data?.isFollowing || false

  const {
    _id,
    avatar,
    avatarUrl,
    avatarId,
    defaultAvatarPath,
    firstName,
    lastName,
    middleName,
    location,
    placeWork,
    rating,
    isVerified,
    stats,
  } = profile

  const fullName = `${lastName} ${firstName} ${middleName || ""}`.trim()
  
  const displayAvatarUrl = getAvatarUrl(avatarUrl || avatar, avatarId, _id, defaultAvatarPath)

  const getSpecializationText = () => {
    if (profile.role === "student") {
      // const studentProfile = profile as SpecialistUser
      // return profile.programType || "Программа не указана"
    } else {
      return profile.mainSpecialization || "Специализация не указана"
    }
  }

  const getExperienceText = () => {
    if (profile.role === "student") {
      // const studentProfile = profile as SpecialistUser
      // return studentProfile.gpa !== undefined ? `GPA: ${studentProfile.gpa.toFixed(2)}` : "GPA: Не указано"
    } else {
      return profile.experience || null
    }
  }

  const specText = getSpecializationText()
  const experienceText = getExperienceText()

  const updateCurrentUserFollowingCount = (increment: boolean) => {
    if (currentUser?.stats) {
      const currentFollowingCount = currentUser.stats.followingCount || 0
      const newFollowingCount = increment ? currentFollowingCount + 1 : currentFollowingCount - 1

      dispatch(
        updateUserFields({
          stats: {
            ...currentUser.stats,
            followingCount: Math.max(0, newFollowingCount),
          },
        }),
      )
    }
  }

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (isProcessing || isFollowLoading || isUnfollowLoading) {
      return
    }

    setIsProcessing(true)

    try {
      if (isFollowing) {
        await unfollowUser(_id).unwrap()
        const currentCount = localFollowersCount !== null ? localFollowersCount : stats?.followersCount || 0
        setLocalFollowersCount(currentCount - 1)
        updateCurrentUserFollowingCount(false)
      } else {
        await followUser(_id).unwrap()
        const currentCount = localFollowersCount !== null ? localFollowersCount : stats?.followersCount || 0
        setLocalFollowersCount(currentCount + 1)
        updateCurrentUserFollowingCount(true)
      }

      await refetchFollowStatus()
    } catch (error: any) {
      console.error("Ошибка при изменении подписки:", error)
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 100)
    }
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    window.location.reload()
  }

  const handleAddContacts = () => {
    router.push(`/profile/${_id}/edit#contacts`)
  }

  const renderActionButton = () => {
    const isButtonLoading = isFollowLoading || isUnfollowLoading || isProcessing
    const publicContacts =
      profile.contacts?.filter((contact) => contact && contact.type && contact.value && contact.isPublic !== false) ||
      []
    const hasAnyContacts = profile.contacts?.length > 0
    const hasPublicContacts = publicContacts.length > 0

    if (!isAuthenticated) {
      return (
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => setShowLoginModal(true)}
            disabled={isButtonLoading}
            style={{ pointerEvents: isButtonLoading ? "none" : "auto" }}
          >
            {isButtonLoading ? <Spinner animation="border" size="sm" /> : "Подписаться"}
          </button>
          {hasPublicContacts && (
            <button className={styles.secondaryButton} onClick={() => setShowContactsModal(true)}>
              Связаться
            </button>
          )}
        </div>
      )
    }

    if (isOwnProfile) {
      return (
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={() => router.push(`/profile/${_id}/edit`)}>
            Редактировать
          </button>
          {hasAnyContacts ? (
            <button className={styles.primaryButton} onClick={() => setShowContactsModal(true)}>
              Мои контакты
            </button>
          ) : (
            <button className={styles.primaryButton} onClick={handleAddContacts}>
              Добавить контакты
            </button>
          )}
        </div>
      )
    }

    return (
      <div className={styles.actions}>
        <button
          className={isFollowing ? styles.secondaryButton : styles.primaryButton}
          onClick={handleFollowToggle}
          disabled={isButtonLoading}
          style={{ pointerEvents: isButtonLoading ? "none" : "auto" }}
        >
          {isButtonLoading ? <Spinner animation="border" size="sm" /> : isFollowing ? "Отписаться" : "Подписаться"}
        </button>
        {hasPublicContacts && (
          <button className={styles.secondaryButton} onClick={() => setShowContactsModal(true)}>
            Связаться
          </button>
        )}
      </div>
    )
  }

  useEffect(() => {
    setLocalFollowersCount(null)
  }, [profile._id])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.left}>
            <Image
              src={displayAvatarUrl || "/placeholder.webp"}
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
              <VerifiedStatusIcons isVerified={isVerified} className={styles.verifiedIconsContainer} />
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
        </div>
        <div className={styles.statsBlock}>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {localFollowersCount !== null ? localFollowersCount : stats?.followersCount || 0}
            </span>
            <span className={styles.statLabel}>Подписчики</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats?.followingCount || 0}</span>
            <span className={styles.statLabel}>Подписки</span>
          </div>
          <div className={`${styles.stat} ${styles.tooltipWrapper}`}>
            <span className={styles.statValueBlue}>{rating || 0}</span>
            <span className={styles.statLabel}>ELO рейтинг</span>
            <div className={styles.tooltipText}>
              {profile.role === "student" ? "Рейтинг студентов пока в разработке" : "Рейтинг врачей пока в разработке"}
            </div>
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

      <NewRegistrationModal
        show={showRegisterModal}
        handleClose={() => setShowRegisterModal(false)}
        switchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
      <ContactsModal
        show={showContactsModal}
        onHide={() => setShowContactsModal(false)}
        contacts={profile.contacts || []}
        isOwner={isOwnProfile}
        title={isOwnProfile ? "Мои контакты" : "Контакты для связи"}
      />
    </>
  )
}