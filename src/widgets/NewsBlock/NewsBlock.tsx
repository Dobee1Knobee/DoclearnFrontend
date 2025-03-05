"use client"

import { NewsCard } from "@/entities/news/ui/NewsCard/NewsCard"
import { NewsList } from "@/entities/news/ui/NewsList/NewsList"
import type { NewsItem } from "@/entities/news/model/types"
import styles from "./NewsBlock.module.css"
import { useEffect, useState } from "react"
import { useWindowSize } from "@/shared/hooks/useWindowSize"

interface NewsBlockProps {
  cityName: string
  featuredNews: NewsItem[]
  relatedNews: NewsItem[]
  showMoreButton?: boolean
}

export function NewsBlock({ cityName, featuredNews, relatedNews, showMoreButton = true }: NewsBlockProps) {
  const { width } = useWindowSize()
  const [displayedNews, setDisplayedNews] = useState(relatedNews)

  useEffect(() => {
    if (width && width <= 950 && width > 768) {
      // Show fewer items on tablet to match main content height
      setDisplayedNews(relatedNews.slice(0, 11))
    } else {
      // Show all items on desktop and mobile
      setDisplayedNews(relatedNews)
    }
  }, [width, relatedNews])

  return (
    <div className={styles.container}>
      <div className={styles.blockTitle}>
        <h2 className={styles.cityName}>{cityName}</h2>
        {showMoreButton && <button className={styles.moreButton}>Ещё</button>}
      </div>
      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <NewsCard news={featuredNews[0]} />
          <NewsCard news={featuredNews[1]} />
        </div>
        <div className={styles.sidebar}>
          <NewsList title="Похожие новости" news={displayedNews} />
        </div>
      </div>
    </div>
  )
}

