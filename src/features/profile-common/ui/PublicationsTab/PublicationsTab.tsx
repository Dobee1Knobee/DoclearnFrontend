'use client'

import type React from 'react'
import type { SpecialistUser } from '@/entities/user/model/types'
import styles from './PublicationsTab.module.css'

interface PublicationsTabProps {
  profile: SpecialistUser
}

export const PublicationsTab: React.FC<PublicationsTabProps> = ({ profile }) => {
  const { publications =[] } = profile

  if (!publications || publications.length === 0) {
    return <div className={styles.empty}>Нет публикаций</div>
  }

  return (
    <div className={styles.container}>
      {publications.map((post) => (
        <article key={post.id} className={styles.item}>
          <div className={styles.meta}>
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <p className={styles.excerpt}>
            {post.content.text.length > 200
              ? post.content.text.slice(0, 200) + '…'
              : post.content.text}
          </p>
        </article>
      ))}
    </div>
  )
}