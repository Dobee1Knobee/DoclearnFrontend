"use client"

import type React from "react"
import type { Education } from "@/entities/user/model/types"
import { GraduationCap } from "lucide-react"
import styles from "./EducationTab.module.css"

interface EducationTabProps {
  education: Education[]
}

export const EducationTab: React.FC<EducationTabProps> = ({ education }) => {
  if (!education.length) {
    return (
      <div className={styles.empty}>
        <GraduationCap size={48} className={styles.emptyIcon} />
        <h4 className={styles.emptyTitle}>Образование не указано</h4>
        <p className={styles.emptyText}>Информация об образовании пока не добавлена</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Образование</span>
          <h3 className={styles.title}>Траектория подготовки</h3>
          <p className={styles.subtitle}>Хронология учебы, ординатуры и других этапов профессионального становления.</p>
        </div>
        <div className={styles.counter}>{education.length}</div>
      </div>

      <div className={styles.timeline}>
        {education.map((edu, index) => (
          <div key={edu._id} className={styles.timelineItem}>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot}>
                <GraduationCap size={16} />
              </div>
              {index < education.length - 1 && <div className={styles.timelineConnector} />}
            </div>

            <div className={styles.timelineContent}>
              <div className={styles.period}>
                {edu.startDate} — {edu.isCurrently ? "наст. время" : edu.graduationYear}
                {edu.isCurrently && <span className={styles.currentBadge}>Сейчас</span>}
              </div>
              <h4 className={styles.institution}>{edu.institution}</h4>
              <p className={styles.degree}>
                {edu.degree}{edu.specialty ? `, ${edu.specialty}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
