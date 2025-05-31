import Link from "next/link"
import type { Article } from "@/entities/article/model/types"
import styles from "./RelatedArticles.module.css"

interface RelatedArticlesProps {
  articles: Article[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Похожие статьи</h2>

      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <div key={article.id} className={styles.articleCard}>
            <Link href={`/Aggregator/articles/${article.id}`} className={styles.articleLink}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
            </Link>

            <div className={styles.articleAuthors}>{article.authors.join(", ")}</div>

            <div className={styles.articleMeta}>
              <span className={styles.journal}>{article.journal}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.date}>{article.publishedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
