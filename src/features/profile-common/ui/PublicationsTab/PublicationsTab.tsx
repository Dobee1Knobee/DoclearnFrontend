'use client'

import React from 'react'
import type { AuthorProfile } from '@/entities/user/model/types'
import styles from './PublicationsTab.module.css'

interface PublicationsTabProps {
  profile: AuthorProfile;
}

export const PublicationsTab: React.FC<PublicationsTabProps> = ({ profile }) => {
  const { publications } = profile

  if (!publications.length) {
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