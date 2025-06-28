'use client'

import React from 'react'
import { useRouter } from "next/navigation"
import type { AuthorProfile } from '@/entities/user/model/types'
import { VerifiedBadge } from '@/shared/ui/VerifiedBadge/VerifiedBadge'
import {
  MapPin,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import styles from './ProfileHeader.module.css'

interface ProfileHeaderProps {
  profile: AuthorProfile
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {

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
    stats
  } = profile

  const fullName = `${firstName} ${lastName}`

  const specText = specialization || "Специализация не указана"

  const router = useRouter()

  return (
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
        
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={() => router.push(`/profile/${_id}/edit`)}> 
            Редактировать
          </button>
          {/* <button className={styles.primaryButton} onClick={() => {}}>
            Подписаться
          </button> */}
        </div>
    </div>
  )
}
