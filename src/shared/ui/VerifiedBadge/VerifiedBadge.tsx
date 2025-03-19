import Image from "next/image"
import styles from "./VerifiedBadge.module.css"

interface VerifiedBadgeProps {
  className?: string
}

export function VerifiedBadge({ className = "" }: VerifiedBadgeProps) {
  return (
    <span className={`${styles.badge} ${className}`}>
      <Image src="/logoGoogle.png" alt="Verified" width={16} height={16} className={styles.icon} />
    </span>
  )
}

