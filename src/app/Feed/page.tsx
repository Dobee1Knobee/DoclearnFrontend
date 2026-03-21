"use client"

import { useState } from "react"
import { useGetFeedQuery } from "@/features/posts/api/postApi"
import { PostCard } from "@/features/posts/ui/PostCard"
import { CreatePostForm } from "@/features/posts/ui/CreatePostForm"
import { FeedSidebar } from "@/features/posts/ui/FeedSidebar/FeedSidebar"
import { Newspaper } from "lucide-react"
import styles from "./page.module.css"

export default function FeedPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, isFetching } = useGetFeedQuery({ page, limit: 20 })

  const posts = data?.data || []
  const hasMore = data?.pagination?.hasMore ?? false

  return (
    <div className={styles.page}>
      <FeedSidebar />

      <main className={styles.main}>
        <CreatePostForm />

        {isLoading && posts.length === 0 && (
          <div className={styles.skeleton}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        )}

        {error && (
          <div className={styles.notice}>Не удалось загрузить ленту. Попробуйте обновить страницу.</div>
        )}

        {!isLoading && posts.length === 0 && !error && (
          <div className={styles.empty}>
            <Newspaper size={36} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Лента пока пуста</h3>
            <p className={styles.emptyText}>Опубликуйте первый пост, чтобы запустить общение.</p>
          </div>
        )}

        <div className={styles.feed}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore && (
          <button type="button" className={styles.more} onClick={() => setPage((p) => p + 1)} disabled={isFetching}>
            {isFetching ? "Загружаем..." : "Ещё публикации"}
          </button>
        )}
      </main>
    </div>
  )
}
