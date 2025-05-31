import Link from "next/link"
import styles from "./ArticleKeywords.module.css"

interface ArticleKeywordsProps {
  keywords: string[]
}

export function ArticleKeywords({ keywords }: ArticleKeywordsProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Теги</h2>
      <div className={styles.keywords}>
        {keywords.map((keyword, index) => (
          <Link key={index} href={`/Aggregator/search?q=${encodeURIComponent(keyword)}`} className={styles.keyword}>
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  )
}
