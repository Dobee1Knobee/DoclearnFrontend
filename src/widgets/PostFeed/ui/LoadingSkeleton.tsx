import styles from "./PostFeed.module.css"

interface LoadingSkeletonProps {
  count?: number
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonDetails}>
              <div className={styles.skeletonName}></div>
              <div className={styles.skeletonDate}></div>
            </div>
          </div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
          </div>
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonActions}>
              <div className={styles.skeletonAction}></div>
              <div className={styles.skeletonAction}></div>
              <div className={styles.skeletonAction}></div>
            </div>
            <div className={styles.skeletonBookmark}></div>
          </div>
        </div>
      ))}
    </>
  )
}

