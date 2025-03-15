"use client"

import { CheckCircle } from "lucide-react"
import { formatDate } from "@/shared/lib/date"
import styles from "./Author.module.css"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"

interface AuthorProps {
  name: string
  avatar: string
  isVerified: boolean
  timestamp: string
  className?: string
}

export function Author({ name, avatar, isVerified, timestamp, className = "" }: AuthorProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.avatar}>
        <div className={styles.image} style={{ backgroundImage: `url(${avatar})` }} />
      </div>
      <div className={styles.info}>
        <div className={styles.nameContainer}>
          <span className={styles.name}>{name}</span>
          {isVerified && <VerifiedBadge />}
        </div>
        <span className={styles.timestamp}>{formatDate(timestamp)}</span>
      </div>
    </div>
  )
}

