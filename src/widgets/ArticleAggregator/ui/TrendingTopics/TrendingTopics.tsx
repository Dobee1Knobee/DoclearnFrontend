"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { TopicItem } from "@/entities/topic/ui/TopicItem/TopicItem"
import { trendingTopics } from "@/entities/topic/model/mockData"
import styles from "./TrendingTopics.module.css"

export function TrendingTopics() {
  const router = useRouter()
  const [topics, setTopics] = useState(trendingTopics)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // "загрузка данных" 
    const timer = setTimeout(() => {
      setTopics(trendingTopics)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleTopicClick = (topicName: string) => {
    router.push(`/Aggregator/search?q=${encodeURIComponent(topicName)}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TrendingUp size={20} className={styles.icon} />
        <h2 className={styles.title}>Популярные запросы</h2>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonCount}></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className={styles.topicsList}>
            {topics.map((topic) => (
              <TopicItem key={topic.id} topic={topic} onClick={() => handleTopicClick(topic.name)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

