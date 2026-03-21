'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { Microscope } from 'lucide-react'
import type { SpecialistUser } from '@/entities/user/model/types'
import { selectUser } from '@/features/auth/model/selectors'
import { useAppSelector } from '@/shared/hooks/hooks'
import { useGetUserPostsQuery } from '@/features/posts/api/postApi'
import { PostCard } from '@/features/posts/ui/PostCard'
import styles from './CasesTab.module.css'

interface CasesTabProps {
  profile: SpecialistUser
}

export const CasesTab: React.FC<CasesTabProps> = ({ profile }) => {
  const router = useRouter()
  const currentUser = useAppSelector(selectUser)
  const isOwner = currentUser?._id === profile._id

  const { data, isLoading } = useGetUserPostsQuery({ userId: profile._id, page: 1, limit: 50 })
  const cases = (data?.data || []).filter((post) => post.medical.isCase)

  if (isLoading) {
    return <div className={styles.stateText}>Загружаем кейсы...</div>
  }

  if (cases.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyIcon}><Microscope size={34} /></div>
        <h3 className={styles.emptyTitle}>{isOwner ? 'Кейсы еще не оформлены' : 'Открытых кейсов пока нет'}</h3>
        <p className={styles.emptyText}>
          {isOwner
            ? 'Добавьте клинические разборы, чтобы профиль выглядел как экспертная витрина.'
            : 'Когда автор оформит клинические кейсы, здесь появится лента с разборами.'}
        </p>
        {isOwner && (
          <button type="button" className={styles.emptyAction} onClick={() => router.push('/Feed')}>
            Создать кейс
          </button>
        )}
      </section>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionIntro}>
        <div>
          <span className={styles.eyebrow}>Практика</span>
          <h3 className={styles.title}>Клинические кейсы</h3>
        </div>
        <div className={styles.noteBadge}>{cases.length} кейсов</div>
      </div>

      <div className={styles.list}>
        {cases.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
