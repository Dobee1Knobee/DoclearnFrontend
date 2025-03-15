"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { MoreHorizontal } from "lucide-react"
import { Author } from "@/entities/post/ui/Author/Author"
import { PostContent } from "@/entities/post/ui/PostContent/PostContent"
import { PostActions } from "@/features/post/ui/PostActions/PostActions"
import type { Post } from "@/entities/post/model/types"
import styles from "./PostCard.module.css"

interface PostCardProps {
  post: Post
  className?: string
  style?: React.CSSProperties
}

export function PostCard({ post, className = "", style }: PostCardProps) {
  const [postState, setPostState] = useState(post)

  const handleLike = useCallback(() => {
    setPostState((prevState) => ({
      ...prevState,
      stats: {
        ...prevState.stats,
        isLiked: !prevState.stats.isLiked,
        likes: prevState.stats.isLiked ? prevState.stats.likes - 1 : prevState.stats.likes + 1,
      },
    }))
  }, [])

  const handleSave = useCallback(() => {
    setPostState((prevState) => ({
      ...prevState,
      stats: {
        ...prevState.stats,
        isSaved: !prevState.stats.isSaved,
      },
    }))
  }, [])

  return (
    <article className={`${styles.container} ${className}`} style={style}>
      <div className={styles.content}>
        <header className={styles.header}>
          <Author
            name={postState.author.name}
            avatar={postState.author.avatar}
            isVerified={postState.author.isVerified}
            timestamp={postState.createdAt}
          />

          <button className={styles.menuButton} aria-label="Дополнительные действия">
            <MoreHorizontal className={styles.menuIcon} />
          </button>
        </header>

        <PostContent text={postState.content.text} images={postState.content.images} links={postState.content.links} />

        <footer className={styles.footer}>
          <PostActions
            likes={postState.stats.likes}
            comments={postState.stats.comments}
            shares={postState.stats.shares}
            isLiked={postState.stats.isLiked}
            isSaved={postState.stats.isSaved}
            onLike={handleLike}
            onSave={handleSave}
          />
        </footer>
      </div>
    </article>
  )
}


