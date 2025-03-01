import { NewsBlock } from "@/widgets/NewsBlock/NewsBlock"
import { featuredNews, relatedNews } from "@/entities/news/model/mockData"
import styles from "./page.module.css"

export default function NewsPage() {
  return (
    <div className={styles.container}>
      <NewsBlock cityName="Главное" featuredNews={featuredNews.slice(0, 2)} relatedNews={relatedNews.slice(0, 15)} showMoreButton={false} />
      <NewsBlock cityName="Свежее" featuredNews={featuredNews.slice(0, 2)} relatedNews={relatedNews.slice(0, 15)} />
      <NewsBlock cityName="Открытия" featuredNews={featuredNews.slice(0, 2)} relatedNews={relatedNews.slice(0, 15)} />
      <NewsBlock cityName="Полезное" featuredNews={featuredNews.slice(0, 2)} relatedNews={relatedNews.slice(0, 15)} />
    </div>
  )
}

