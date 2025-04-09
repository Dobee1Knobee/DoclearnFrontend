"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { ArticleItem } from "@/entities/article/ui/ArticleItem/ArticleItem"
import { mockArticles } from "@/entities/article/model/mockData"
import styles from "./RecentPublications.module.css"

export function RecentPublications() {
  const [articles, setArticles] = useState(mockArticles)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // "загрузка данных" 
    const timer = setTimeout(() => {
      setArticles(mockArticles)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Clock size={20} className={styles.icon} />
        <h2 className={styles.title}>Недавние публикации</h2>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonSource}></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className={styles.articlesList}>
            {articles.slice(0, 5).map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

