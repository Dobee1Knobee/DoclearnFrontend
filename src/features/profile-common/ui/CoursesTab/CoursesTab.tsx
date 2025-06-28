'use client'

import React from 'react'
import type { AuthorProfile } from '@/entities/user/model/types'
import styles from './CoursesTab.module.css'

interface CoursesTabProps {
  profile: AuthorProfile
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ profile }) => {
  const { courses } = profile

  if (!courses.length) {
    return <div className={styles.empty}>Курсов нет</div>
  }

  return (
    <div className={styles.container}>
      {courses.map((course) => (
        <div key={course.id} className={styles.item}>
          <h3 className={styles.title}>{course.title}</h3>
          {('description' in course) && (
            <p className={styles.description}>
              {/* если в типе есть описание */}
              {(course as any).description}
            </p>
          )}
          {course.createdAt && (
            <div className={styles.date}>
              {new Date(course.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
