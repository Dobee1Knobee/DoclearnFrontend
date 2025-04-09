"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PostCard } from "../PostCard/ui/PostCard"
import type { Post } from "@/entities/post/model/types"
import styles from "./PostFeed.module.css"

interface PostFeedProps {
  initialPosts: Post[]
}

export function PostFeed({ initialPosts }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchPosts = useCallback(async () => {
    try {
      // Имитация загрузки данных с сервера
      await new Promise((resolve) => setTimeout(resolve, 800))
      setPosts(initialPosts)
      setLoading(false)
    } catch (err) {
      setError("Не удалось загрузить посты. Пожалуйста, попробуйте позже.")
      setLoading(false)
    }
  }, [initialPosts])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.content}>
        {loading ? (
          // Встроенный скелетон вместо отдельного компонента
          <>
            {[1, 2].map((index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                  <div className={styles.skeletonAvatar}></div>
                  <div className={styles.skeletonInfo}>
                    <div className={styles.skeletonName}></div>
                    <div className={styles.skeletonDate}></div>
                  </div>
                </div>
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: "75%" }}></div>
                </div>
                <div className={styles.skeletonImageContainer}></div>
                <div className={styles.skeletonFooter}>
                  <div className={styles.skeletonActions}>
                    <div className={styles.skeletonAction}></div>
                    <div className={styles.skeletonAction}></div>
                    <div className={styles.skeletonAction}></div>
                  </div>
                  <div className={styles.skeletonBookmark}></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              className={styles.postAnimation}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))
        )}
      </div>
    </div>
  )
}
