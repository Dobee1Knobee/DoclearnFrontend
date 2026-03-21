'use client'

import type React from "react"
import type { SpecialistUser } from '@/entities/user/model/types'
import { useRouter } from "next/navigation"
import { selectUser } from "@/features/auth/model/selectors"
import { useAppSelector } from "@/shared/hooks/hooks"
import {
  AlertCircle,
  Briefcase,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  GraduationCap,
  Pencil,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import { useGetUserPostsQuery } from '@/features/posts/api/postApi'
import styles from './OverviewTab.module.css'

interface OverviewTabProps {
  profile: SpecialistUser
}

interface ProfileField {
  label: string
  filled: boolean
  icon: React.ReactNode
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'student':
      return 'Студент'
    case 'resident':
      return 'Ординатор'
    case 'postgraduate':
      return 'Аспирант'
    case 'doctor':
      return 'Врач'
    case 'researcher':
      return 'Исследователь'
    case 'admin':
      return 'Администратор'
    case 'owner':
      return 'Владелец'
    default:
      return 'Пользователь'
  }
}

function calculateProfileCompletion(profile: SpecialistUser): { percent: number; fields: ProfileField[] } {
  const fields: ProfileField[] = [
    { label: 'Фото профиля', filled: !!(profile.avatar || profile.avatarUrl), icon: <UserIcon size={16} /> },
    { label: 'О себе', filled: !!profile.bio?.trim(), icon: <FileText size={16} /> },
    { label: 'Место работы/учёбы', filled: !!(profile.placeWork || profile.placeStudy), icon: <Briefcase size={16} /> },
    {
      label: 'Образование',
      filled: !!(Array.isArray(profile.education) ? profile.education.length > 0 : profile.education),
      icon: <GraduationCap size={16} />,
    },
    { label: 'Контакты', filled: (profile.contacts?.length || 0) > 0, icon: <Phone size={16} /> },
    { label: 'Документы', filled: (profile.documents?.length || 0) > 0, icon: <FolderOpen size={16} /> },
    { label: 'Локация', filled: !!profile.location?.trim(), icon: <MapPin size={16} /> },
  ]

  const filledCount = fields.filter((item) => item.filled).length
  return { percent: Math.round((filledCount / fields.length) * 100), fields }
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ profile }) => {
  const currentUser = useAppSelector(selectUser)
  const router = useRouter()
  const isOwner = currentUser?._id === profile._id

  const { data: postsData } = useGetUserPostsQuery({ userId: profile._id, page: 1, limit: 1 })
  const realPostsCount = postsData?.pagination ? (postsData.data?.length || 0) + (postsData.pagination.hasMore ? 1 : 0) : 0
  const publicationsCount = postsData ? postsData.data.length : (profile.publications?.length || 0)

  const { percent, fields } = calculateProfileCompletion(profile)
  const missingFields = fields.filter((item) => !item.filled)
  const educationCount = Array.isArray(profile.education) ? profile.education.length : profile.education ? 1 : 0
  const documentsCount = profile.documents?.length || 0
  const primaryAbout = profile.bio?.split(/\n{2,}/)[0] || ''
  const extraAbout = profile.bio?.split(/\n{2,}/).slice(1) || []

  const quickCards = [
    {
      title: 'Публикации',
      value: publicationsCount,
      icon: <FileText size={20} />,
      description: publicationsCount > 0 ? 'материалов' : 'пусто',
      action: () => router.push(`/profile/${profile._id}?tab=publications`),
    },
    {
      title: 'Образование',
      value: educationCount,
      icon: <GraduationCap size={20} />,
      description: educationCount > 0 ? 'этапов' : 'пусто',
      action: () => router.push(`/profile/${profile._id}?tab=education`),
    },
    {
      title: 'Документы',
      value: documentsCount,
      icon: <FolderOpen size={20} />,
      description: documentsCount > 0 ? 'файлов' : 'пусто',
      action: () => router.push(`/profile/${profile._id}?tab=documents`),
    },
  ]

  const profileFacts = [
    profile.location
      ? { icon: <MapPin size={16} />, label: 'Локация', value: profile.location }
      : null,
    profile.experience
      ? { icon: <Clock size={16} />, label: 'Опыт', value: profile.experience }
      : null,
    profile.placeWork || profile.placeStudy
      ? { icon: <Briefcase size={16} />, label: 'База', value: profile.placeWork || profile.placeStudy || '' }
      : null,
  ].filter(Boolean) as Array<{ icon: React.ReactNode; label: string; value: string }>

  return (
    <div className={styles.layout}>
      <div className={styles.mainColumn}>
        <section className={styles.storyCard}>
          <div className={styles.cardTopline}>Обзор профиля</div>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>О себе</h3>
            <span className={styles.sectionTag}>{getRoleLabel(profile.role)}</span>
          </div>

          {profile.bio ? (
            <div className={styles.aboutContent}>
              <p className={styles.aboutLead}>{primaryAbout}</p>
              {extraAbout.map((paragraph, index) => (
                <p key={index} className={styles.aboutParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className={styles.emptyStory}>
              <p className={styles.emptyTitle}>Описание пока не заполнено</p>
              <p className={styles.emptyText}>
                {isOwner
                  ? 'Добавьте краткое профессиональное описание, чтобы профиль воспринимался как полноценная медицинская карточка.'
                  : 'Пользователь еще не добавил описание профиля.'}
              </p>
            </div>
          )}
        </section>

        <section className={styles.quickGrid}>
          {quickCards.map((card) => (
            <button key={card.title} type="button" className={styles.quickCard} onClick={card.action}>
              <div className={styles.quickCardIcon}>{card.icon}</div>
              <div className={styles.quickCardBody}>
                <span className={styles.quickCardValue}>{card.value}</span>
                <span className={styles.quickCardTitle}>{card.title}</span>
                <span className={styles.quickCardDescription}>{card.description}</span>
              </div>
              <ChevronRight size={18} className={styles.quickCardArrow} />
            </button>
          ))}
        </section>
      </div>

      <aside className={styles.sideColumn}>
        {isOwner && percent < 100 ? (
          <section className={styles.sideCard}>
            <div className={styles.completionHeader}>
              <div className={styles.completionTitleWrap}>
                <AlertCircle size={18} className={styles.completionIcon} />
                <span className={styles.sideTitle}>Заполненность профиля</span>
              </div>
              <span className={styles.completionPercent}>{percent}%</span>
            </div>

            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>

            <p className={styles.completionText}>
              {missingFields.length > 0
                ? `Не заполнено: ${missingFields.slice(0, 3).map((field) => field.label.toLowerCase()).join(', ')}`
                : 'Профиль выглядит заполненным'}
            </p>

            <div className={styles.missingList}>
              {missingFields.slice(0, 3).map((field) => (
                <span key={field.label} className={styles.missingTag}>
                  <span className={styles.missingIcon}>{field.icon}</span>
                  <span>{field.label}</span>
                </span>
              ))}
            </div>

            <button type="button" className={styles.editButton} onClick={() => router.push(`/profile/${profile._id}/edit`)}>
              <Pencil size={15} />
              Дополнить профиль
            </button>
          </section>
        ) : (
          <section className={styles.sideCard}>
            <div className={styles.cardTopline}>Статус</div>
            <h3 className={styles.sideTitle}>Профиль опубликован</h3>
            <p className={styles.sideText}>
              Карточка уже выглядит как отдельное профессиональное пространство и собирает все ключевые сведения в одном месте.
            </p>
          </section>
        )}

        {profileFacts.length > 0 && (
          <section className={styles.sideCard}>
            <div className={styles.cardTopline}>Факты</div>
            <h3 className={styles.sideTitle}>Срез профиля</h3>
            <div className={styles.factList}>
              {profileFacts.map((fact) => (
                <div key={fact.label} className={styles.factItem}>
                  <span className={styles.factIcon}>{fact.icon}</span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{fact.label}</span>
                    <span className={styles.factValue}>{fact.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>
    </div>
  )
}
