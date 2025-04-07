"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/features/article-search/ui/SearchBar/SearchBar"
import { TrendingTopics } from "@/widgets/ArticleAggregator/ui/TrendingTopics/TrendingTopics"
import { RecentPublications } from "@/widgets/ArticleAggregator/ui/RecentPublications/RecentPublications"
import styles from "./ArticleAggregator.module.css"

export function ArticleAggregator() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()


  const handleSearch = (query: string) => {
    setSearchQuery(query)
    router.push(`/Aggregator/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Агрегатор Научных Статей</h1>
      <p className={styles.subtitle}>
        Доступ к миллионам научных публикаций, исследовательских работ и журналов в одном месте
      </p>

      <div className={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className={styles.contentGrid}>
        <TrendingTopics />
        <RecentPublications />
      </div>
    </div>
  )
}

