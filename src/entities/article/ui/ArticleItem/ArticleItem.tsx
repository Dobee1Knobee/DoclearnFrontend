import Link from "next/link"
import type { Article } from "@/entities/article/model/types"
import styles from "./ArticleItem.module.css"

interface ArticleItemProps {
  article: Article
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <li className={styles.articleItem}>
      <Link href={`/Aggregator/articles/${article.id}`} className={styles.articleLink}>
        <h3 className={styles.articleTitle}>{article.title}</h3>
      </Link>
      <div className={styles.articleMeta}>
        <span className={styles.journalName}>{article.journal}</span>
        <span className={styles.separator}>•</span>
        <span className={styles.publicationDate}>{article.publishedDate}</span>
      </div>
    </li>
  )
}

