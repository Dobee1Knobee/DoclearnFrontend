import Image from "next/image"
import { formatDate } from "@/shared/lib/date"
import type { NewsItem } from "@/entities/news/model/types"
import styles from "./NewsCard.module.css"

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <div className={styles.card}>
      {news.image && (
        <div className={styles.imageContainer}>
          <Image
            src={news.image || "/banner.jpg"}
            alt={news.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.sourceInfo}>
          <div className={styles.sourceIcon}>
            <Image
              src={news.source.icon || "/logoGoogle.png"}
              alt={news.source.name}
              width={20}
              height={20}
              className={styles.icon}
            />
          </div>
          <span className={styles.sourceName}>{news.source.name}</span>
          <span className={styles.publishDate}>{formatDate(news.publishedAt)}</span>
        </div>
        <h2 className={styles.title}>{news.title}</h2>
        {news.description && <p className={styles.description}>{news.description}</p>}
      </div>
    </div>
  )
}

