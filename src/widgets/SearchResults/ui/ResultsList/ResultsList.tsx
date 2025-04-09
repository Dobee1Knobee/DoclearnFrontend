"use client"

import { ArticleCard } from "@/entities/article/ui/ArticleCard/ArticleCard"
import { ArticleSkeleton } from "@/entities/article/ui/ArticleSkeleton/ArticleSkeleton"
import type { Article } from "@/entities/article/model/types"
import styles from "./ResultsList.module.css"

interface ResultsListProps {
  articles: Article[]
  loading: boolean
}

export function ResultsList({ articles, loading }: ResultsListProps) {
  if (loading) {
    return (
      <div className={styles.container}>
        {Array.from({ length: 5 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Ничего не найдено. Попробуйте изменить поисковый запрос или фильтры.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

