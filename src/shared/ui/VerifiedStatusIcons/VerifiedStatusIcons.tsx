"use client"

import { CheckCheck, GraduationCap, Stethoscope, BriefcaseMedical, Microscope } from "lucide-react"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import type { SpecialistUser } from "@/entities/user/model/types"
import styles from "./VerifiedStatusIcons.module.css"

interface VerifiedStatusIconsProps {
  isVerified: SpecialistUser["isVerified"]
  className?: string
}

export function VerifiedStatusIcons({ isVerified, className }: VerifiedStatusIconsProps) {
  const getProfessionalVerificationIcon = () => {
    if (isVerified.researcher) {
      return (
        <div className={styles.tooltipWrapper}>
          <Microscope size={20} className={`${styles.icon} ${styles.specificIcon}`} />
          <span className={styles.tooltipText}>Верифицированный научный сотрудник</span>
        </div>
      )
    }

    if (isVerified.doctor) {
      return (
        <div className={styles.tooltipWrapper}>
          <VerifiedBadge className={styles.icon} />
          <span className={styles.tooltipText}>Верифицированный врач</span>
        </div>
      )
    }

    if (isVerified.postgraduate) {
      return (
        <div className={styles.tooltipWrapper}>
          <BriefcaseMedical size={20} className={`${styles.icon} ${styles.specificIcon}`} />
          <span className={styles.tooltipText}>Верифицированный аспирант</span>
        </div>
      )
    }

    if (isVerified.resident) {
      return (
        <div className={styles.tooltipWrapper}>
          <Stethoscope size={20} className={`${styles.icon} ${styles.specificIcon}`} />
          <span className={styles.tooltipText}>Верифицированный ординатор</span>
        </div>
      )
    }

    if (isVerified.student) {
      return (
        <div className={styles.tooltipWrapper}>
          <GraduationCap size={20} className={`${styles.icon} ${styles.specificIcon}`} />
          <span className={styles.tooltipText}>Верифицированный студент</span>
        </div>
      )
    }

    return null
  }

  const professionalIcon = getProfessionalVerificationIcon()

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {isVerified.user && (
        <div className={styles.tooltipWrapper}>
          <CheckCheck size={20} className={`${styles.icon} ${styles.userIcon}`} />
          <span className={styles.tooltipText}>Верифицированный пользователь</span>
        </div>
      )}
      {professionalIcon}
    </div>
  )
}
