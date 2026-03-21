"use client"

import type React from "react"
import styles from "./ProfileSkeleton.module.css"

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={styles.banner} />
        <div className={styles.heroBody}>
          <div className={styles.avatarSkeleton} />
          <div className={styles.infoSkeleton}>
            <div className={`${styles.line} ${styles.lineLg}`} />
            <div className={`${styles.line} ${styles.lineMd}`} />
            <div className={styles.metaSkeleton}>
              <div className={`${styles.line} ${styles.chip}`} />
              <div className={`${styles.line} ${styles.chip}`} />
            </div>
          </div>
          <div className={styles.statsSkeleton}>
            <div className={styles.statBlock} />
            <div className={styles.statBlock} />
            <div className={styles.statBlock} />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.sectionTitle}`} />
        <div className={`${styles.line} ${styles.lineFull}`} />
        <div className={`${styles.line} ${styles.lineFull}`} />
        <div className={`${styles.line} ${styles.lineLg}`} />
        <div style={{ height: "1.5rem" }} />
        <div className={`${styles.line} ${styles.sectionTitle}`} />
        <div className={styles.cardGrid}>
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
    </div>
  )
}
