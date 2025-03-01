import Image from "next/image"
import type { NewsItem } from "@/entities/news/model/types"
import styles from "./NewsList.module.css"

interface NewsList {
  title: string
  news: NewsItem[]
}

export function NewsList({ title, news }: NewsList) {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.list}>
        {news.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <div className={styles.sourceIcon}>
              <Image
                src={item.source.icon || "/logoGoogle.png"}
                alt={item.source.name}
                width={24}
                height={24}
                className={styles.icon}
              />
            </div>
            <h3 className={styles.title}>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

