import styles from "./ArticleMetadata.module.css"
import type { Article } from "@/entities/article/model/types"

interface ArticleMetadataProps {
  article: Article
}

export function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.title}>Детали</h2>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Журнал:</span>
            <span className={styles.value}>{article.journal || "N/A"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Издатель:</span>
            <span className={styles.value}>{article.publisher || "N/A"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Страниц:</span>
            <span className={styles.value}>{article.pages || "N/A"}</span>
          </div>

          {/* <div className={styles.detailItem}>
            <span className={styles.label}>Опубликована:</span>
            <span className={styles.value}>{article.publishedDate || "N/A"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>DOI:</span>
            <span className={styles.value}>{article.doi || "N/A"}</span>
          </div> */}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Метрики</h2>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Цитирование:</span>
            <span className={styles.value}>{article.citations || 0}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Просмотры:</span>
            <span className={styles.value}>{article.views?.toLocaleString() || "0"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Скачиваний:</span>
            <span className={styles.value}>{article.downloads?.toLocaleString() || "0"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Altmetric оценка:</span>
            <span className={styles.value}>{article.altmetricScore || 0}</span>
          </div>
        </div>
      </div>
    </>
  )
}
