"use client"

import { CheckCheck, GraduationCap, Stethoscope, BriefcaseMedical, Microscope } from "lucide-react"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import type { SpecialistUser } from "@/entities/user/model/types"
import styles from "./VerificationIcons.module.css"

interface VerificationIconsProps {
  isVerified: SpecialistUser["isVerified"]
  className?: string
}

export function VerificationIcons({ isVerified, className }: VerificationIconsProps) {
  const getProfessionalVerificationIcon = () => {
    if (isVerified.researcher) {
      return <Microscope size={16} className={`${styles.icon} ${styles.specificIcon}`} />
    }

    if (isVerified.doctor) {
      return <VerifiedBadge className={styles.icon} />
    }

    if (isVerified.postgraduate) {
      return <BriefcaseMedical size={16} className={`${styles.icon} ${styles.specificIcon}`} />
    }

    if (isVerified.resident) {
      return <Stethoscope size={16} className={`${styles.icon} ${styles.specificIcon}`} />
    }

    if (isVerified.student) {
      return <GraduationCap size={16} className={`${styles.icon} ${styles.specificIcon}`} />
    }

    return null
  }

  const professionalIcon = getProfessionalVerificationIcon()

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {isVerified.user && <CheckCheck size={16} className={`${styles.icon} ${styles.userIcon}`} />}
      {professionalIcon}
    </div>
  )
}
