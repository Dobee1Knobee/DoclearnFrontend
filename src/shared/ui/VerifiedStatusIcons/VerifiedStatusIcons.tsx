"use client"

import { CheckCheck, GraduationCap } from "lucide-react"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import type { SpecialistUser } from "@/entities/user/model/types"
import styles from "./VerifiedStatusIcons.module.css"

interface VerifiedStatusIconsProps {
  isVerified: SpecialistUser["isVerified"]
  className?: string
}

export function VerifiedStatusIcons({ isVerified, className }: VerifiedStatusIconsProps) {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      {isVerified.doctor && (
        <div className={styles.tooltipWrapper}>
          <VerifiedBadge className={styles.icon} />
          <span className={styles.tooltipText}>Верифицированный врач</span>
        </div>
      )}
      {isVerified.user && (
        <div className={styles.tooltipWrapper}>
          <CheckCheck size={20} className={`${styles.icon} ${styles.userIcon}`} />
          <span className={styles.tooltipText}>Верифицированный пользователь</span>
        </div>
      )}
      {isVerified.student && (
        <div className={styles.tooltipWrapper}>
          <GraduationCap size={20} className={`${styles.icon} ${styles.studentIcon}`} />
          <span className={styles.tooltipText}>Верифицированный студент</span>
        </div>
      )}
    </div>
  )
}
