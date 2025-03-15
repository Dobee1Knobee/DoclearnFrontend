"use client"

import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { formatNumber } from "@/shared/lib/formatNumber"
import styles from "./PostActions.module.css"

interface PostActionsProps {
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isSaved: boolean
  onLike: () => void
  onSave: () => void
  className?: string
}

export function PostActions({
  likes,
  comments,
  shares,
  isLiked,
  isSaved,
  onLike,
  onSave,
  className = "",
}: PostActionsProps) {
  return (
    <div className={`${styles.actions} ${className}`}>
      <div className={styles.buttons}>
        <button
          onClick={onLike}
          className={`${styles.button} ${styles.likeButton} ${isLiked ? styles.active : ""}`}
          aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
          aria-pressed={isLiked}
        >
          <Heart className={styles.icon} />
          <span className={styles.label}>{formatNumber(likes)}</span>
        </button>

        <button className={`${styles.button} ${styles.commentButton}`} aria-label="Комментировать">
          <MessageCircle className={styles.icon} />
          <span className={styles.label}>{formatNumber(comments)}</span>
        </button>

        <button className={`${styles.button} ${styles.shareButton}`} aria-label="Поделиться">
          <Share2 className={styles.icon} />
          <span className={styles.label}>{formatNumber(shares)}</span>
        </button>
      </div>

      <button
        onClick={onSave}
        className={`${styles.button} ${styles.bookmarkButton} ${isSaved ? styles.active : ""}`}
        aria-label={isSaved ? "Убрать из сохраненных" : "Сохранить"}
        aria-pressed={isSaved}
      >
        <Bookmark className={styles.icon} />
      </button>
    </div>
  )
}


