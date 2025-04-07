import Link from "next/link"
import styles from "./ArticleTags.module.css"

interface ArticleTagsProps {
  keywords: string[]
}

export function ArticleTags({ keywords }: ArticleTagsProps) {
  return (
    <div className={styles.container}>
      {keywords.map((keyword, index) => (
        <Link key={index} href={`/Aggregator/search?q=${encodeURIComponent(keyword)}`} className={styles.tag}>
          {keyword}
        </Link>
      ))}
    </div>
  )
}

