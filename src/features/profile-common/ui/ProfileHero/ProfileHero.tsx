"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Spinner } from "react-bootstrap"
import {
  Clock,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Pencil,
  Phone,
  UserPlus,
  Users,
} from "lucide-react"
import type { ResearcherUser, SpecialistUser } from "@/entities/user/model/types"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { updateUserFields } from "@/features/auth/model/slice"
import {
  useCheckFollowStatusQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/features/profile-edit/api/profileEditApi"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import { VerifiedStatusIcons } from "@/shared/ui/VerifiedStatusIcons/VerifiedStatusIcons"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import NewRegistrationModal from "@/features/auth/ui/Registration/NewRegistrationModal"
import { ContactsModal } from "../ContactsModal/ContactsModal"
import styles from "./ProfileHero.module.css"

interface ProfileHeroProps {
  profile: SpecialistUser
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
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
    avatarId,
    avatarUrl,
    defaultAvatarPath,
    firstName,
    lastName,
    middleName,
    location,
    rating,
    isVerified,
    stats,
  } = profile

  const fullName = `${lastName} ${firstName} ${middleName || ""}`.trim()
  const fallbackAvatarSrc = defaultAvatarPath || "/placeholder.webp"
  const displayAvatarUrl = getAvatarUrl(avatarUrl || avatar, avatarId, _id, fallbackAvatarSrc)
  const [avatarSrc, setAvatarSrc] = useState(displayAvatarUrl)

  const getSpecializationText = (userProfile: SpecialistUser): string => {
    switch (userProfile.role) {
      case "student":
        return "Студент"
      case "resident":
        return "Ординатор"
      case "postgraduate":
        return "Аспирант"
      case "doctor":
      case "researcher":
      case "admin":
      case "owner": {
        const specializations = (userProfile as ResearcherUser).specializations?.filter((item) => item.main)
        if (specializations && specializations.length > 0) {
          return specializations.map((item) => item.name).join(", ")
        }
        return "Специализация не указана"
      }
      default:
        return "Специализация не указана"
    }
  }

  const specialization = getSpecializationText(profile)
  const experienceText = profile.experience || null
  const followersCount = localFollowersCount !== null ? localFollowersCount : stats?.followersCount || 0
  const followingCount = stats?.followingCount || 0
  const heroDescription = profile.bio?.trim()
    ? profile.bio.split(/\n{2,}/)[0]
    : isOwnProfile
      ? "Оформите профиль как полноценную профессиональную карточку: добавьте описание, контакты и документы."
      : "Пользователь еще не добавил описание, но профиль уже оформлен как профессиональная карточка."

  const updateCurrentUserFollowingCount = (increment: boolean) => {
    if (!currentUser?.stats) {
      return
    }

    const currentCount = currentUser.stats.followingCount || 0
    dispatch(
      updateUserFields({
        stats: {
          ...currentUser.stats,
          followingCount: Math.max(0, increment ? currentCount + 1 : currentCount - 1),
        },
      }),
    )
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
      const currentCount = localFollowersCount !== null ? localFollowersCount : stats?.followersCount || 0

      if (isFollowing) {
        await unfollowUser(_id).unwrap()
        setLocalFollowersCount(currentCount - 1)
        updateCurrentUserFollowingCount(false)
      } else {
        await followUser(_id).unwrap()
        setLocalFollowersCount(currentCount + 1)
        updateCurrentUserFollowingCount(true)
      }

      await refetchFollowStatus()
    } catch (error) {
      console.error("Follow error:", error)
    } finally {
      setTimeout(() => setIsProcessing(false), 100)
    }
  }

  const publicContacts = profile.contacts?.filter((item) => item && item.type && item.value && item.isPublic !== false) || []
  const hasAnyContacts = (profile.contacts?.length || 0) > 0
  const hasPublicContacts = publicContacts.length > 0
  const isButtonLoading = isFollowLoading || isUnfollowLoading || isProcessing

  useEffect(() => {
    setLocalFollowersCount(null)
  }, [profile._id])

  useEffect(() => {
    setAvatarSrc(displayAvatarUrl)
  }, [displayAvatarUrl])

  const handleAvatarError = () => {
    if (avatarSrc !== fallbackAvatarSrc) {
      setAvatarSrc(fallbackAvatarSrc)
      return
    }

    if (fallbackAvatarSrc !== "/placeholder.webp") {
      setAvatarSrc("/placeholder.webp")
    }
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    window.location.reload()
  }

  const renderActions = () => {
    if (isOwnProfile) {
      return (
        <>
          <button className={styles.btnPrimary} onClick={() => router.push(`/profile/${_id}/edit`)}>
            <Pencil size={16} />
            Редактировать профиль
          </button>
          {hasAnyContacts ? (
            <button className={styles.btnGhost} onClick={() => setShowContactsModal(true)}>
              <Phone size={16} />
              Контакты
            </button>
          ) : (
            <button className={styles.btnGhost} onClick={() => router.push(`/profile/${_id}/edit#contacts`)}>
              <Phone size={16} />
              Добавить контакты
            </button>
          )}
        </>
      )
    }

    if (!isAuthenticated) {
      return (
        <>
          <button className={styles.btnPrimary} onClick={() => setShowLoginModal(true)} disabled={isButtonLoading}>
            <UserPlus size={16} />
            Подписаться
          </button>
          {hasPublicContacts && (
            <button className={styles.btnGhost} onClick={() => setShowContactsModal(true)}>
              <Phone size={16} />
              Связаться
            </button>
          )}
        </>
      )
    }

    return (
      <>
        <button
          className={isFollowing ? styles.btnSecondary : styles.btnPrimary}
          onClick={handleFollowToggle}
          disabled={isButtonLoading}
        >
          {isButtonLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              {isFollowing ? <Users size={16} /> : <UserPlus size={16} />}
              {isFollowing ? "Отписаться" : "Подписаться"}
            </>
          )}
        </button>
        {hasPublicContacts && (
          <button className={styles.btnGhost} onClick={() => setShowContactsModal(true)}>
            <Phone size={16} />
            Связаться
          </button>
        )}
      </>
    )
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.banner}>
          <div className={styles.bannerPattern} />
          <div className={styles.bannerRow}>
            <span className={styles.eyebrow}>{isOwnProfile ? "Личный кабинет" : "Профессиональный профиль"}</span>
            <span className={styles.bannerNote}>{isVerified?.doctor ? "Профиль подтвержден" : "Открытая карточка"}</span>
          </div>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.identityPanel}>
            <div className={styles.avatarWrapper}>
              <Image
                src={avatarSrc || "/placeholder.webp"}
                alt={fullName}
                width={136}
                height={136}
                className={styles.avatar}
                priority
                unoptimized={avatarSrc.startsWith("blob:")}
                onError={handleAvatarError}
              />
              {isVerified?.doctor && <div className={styles.verifiedBadge} title="Верифицированный врач" />}
            </div>

            <div className={styles.identityContent}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{fullName}</h1>
                <VerifiedStatusIcons isVerified={isVerified} className={styles.verifiedIcons} />
              </div>

              <div className={styles.roleRow}>
                <span className={styles.specialization}>{specialization}</span>
                {isVerified?.doctor && <span className={styles.verificationPill}>Подтвержденный профиль</span>}
              </div>

              <div className={styles.metaRow}>
                {location && (
                  <span className={styles.metaChip}>
                    <MapPin size={14} />
                    <span>{location}</span>
                  </span>
                )}
                {experienceText && (
                  <span className={styles.metaChip}>
                    <Clock size={14} />
                    <span>{experienceText}</span>
                  </span>
                )}
                {profile.placeWork ? (
                  <span className={styles.metaChip}>
                    <BriefcaseBusiness size={14} />
                    <span>{profile.placeWork}</span>
                  </span>
                ) : profile.placeStudy ? (
                  <span className={styles.metaChip}>
                    <GraduationCap size={14} />
                    <span>{profile.placeStudy}</span>
                  </span>
                ) : null}
              </div>

              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Кратко о профиле</span>
                <p className={styles.summaryText}>{heroDescription}</p>
              </div>

              <div className={styles.actions}>{renderActions()}</div>
            </div>
          </div>

          <aside className={styles.sidePanel}>
            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>{followersCount}</span>
                <span className={styles.metricLabel}>Подписчики</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>{followingCount}</span>
                <span className={styles.metricLabel}>Подписки</span>
              </div>
              <div className={styles.metricCard}>
                <span className={`${styles.metricValue} ${styles.metricAccent}`}>{rating || 0}</span>
                <span className={styles.metricLabel}>ELO</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

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
