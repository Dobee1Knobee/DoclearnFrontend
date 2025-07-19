"use client"

import { CheckCheck, GraduationCap } from "lucide-react"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import type { User } from "@/entities/user/model/types"
import styles from "./VerifiedStatusIcons.module.css"

interface VerifiedStatusIconsProps {
  isVerified: User["isVerified"]
  className?: string
}

export function VerifiedStatusIcons({ isVerified, className }: VerifiedStatusIconsProps) {
  return (
    <div className={(styles.container, className)}>
      {isVerified.doctor && <VerifiedBadge className={styles.icon} />}
      {isVerified.user && <CheckCheck size={20} className={(styles.icon, styles.userIcon)} />}
      {isVerified.student && <GraduationCap size={20} className={(styles.icon, styles.studentIcon)} />}
    </div>
  )
}
