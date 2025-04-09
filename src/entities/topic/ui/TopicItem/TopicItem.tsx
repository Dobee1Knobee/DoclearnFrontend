"use client"

import type { Topic } from "@/entities/topic/model/types"
import styles from "./TopicItem.module.css"

interface TopicItemProps {
  topic: Topic
  onClick?: () => void
}

export function TopicItem({ topic, onClick }: TopicItemProps) {
  return (
    <li className={styles.topicItem} >
      <span className={styles.topicName} onClick={onClick}>{topic.name}</span>
      <span className={styles.articleCount}>{topic.articleCount} статей</span>
    </li>
  )
}

