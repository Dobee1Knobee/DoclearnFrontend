'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { PenSquare } from 'lucide-react'
import type { SpecialistUser } from '@/entities/user/model/types'
import { selectUser } from '@/features/auth/model/selectors'
import { useAppSelector } from '@/shared/hooks/hooks'
import { useGetUserPostsQuery } from '@/features/posts/api/postApi'
import { PostCard } from '@/features/posts/ui/PostCard'
import styles from './PublicationsTab.module.css'

interface PublicationsTabProps {
  profile: SpecialistUser
}

export const PublicationsTab: React.FC<PublicationsTabProps> = ({ profile }) => {
  const router = useRouter()
  const currentUser = useAppSelector(selectUser)
  const isOwner = currentUser?._id === profile._id

  const { data, isLoading } = useGetUserPostsQuery({ userId: profile._id, page: 1, limit: 50 })
  const posts = data?.data || []

  if (isLoading) {
    return <div className={styles.stateText}>Загружаем публикации...</div>
  }

  if (posts.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyIcon}><PenSquare size={34} /></div>
        <h3 className={styles.emptyTitle}>{isOwner ? 'Публикаций пока нет' : 'Пользователь еще не публиковал материалы'}</h3>
        <p className={styles.emptyText}>
          {isOwner
            ? 'Начните с короткой заметки, разбора случая или полезного материала.'
            : 'Когда здесь появятся посты, раздел станет похож на авторскую библиотеку.'}
        </p>
        {isOwner && (
          <button type="button" className={styles.emptyAction} onClick={() => router.push('/Feed')}>
            Перейти в ленту
          </button>
        )}
      </section>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionIntro}>
        <div>
          <span className={styles.eyebrow}>Контент</span>
          <h3 className={styles.title}>Публикации</h3>
        </div>
        <div className={styles.counterCard}>
          <span className={styles.counterValue}>{posts.length}</span>
          <span className={styles.counterLabel}>публикаций</span>
        </div>
      </div>

      <div className={styles.list}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
