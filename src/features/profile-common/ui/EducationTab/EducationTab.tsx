"use client"

import type React from "react"
import type { Education } from "@/entities/user/model/types"
import styles from "./EducationTab.module.css"

interface EducationTabProps {
  education: Education[]
}

export const EducationTab: React.FC<EducationTabProps> = ({ education }) => {
  if (!education.length) {
    return <div className={styles.empty}>Образование не указано</div>
  }

  // const formatYear = (dateString: string) => {
  //   try {
  //     return new Date(dateString).getFullYear()
  //   } catch {
  //     return dateString 
  //   }
  // }

  console.log(education)

  return (
    <div className={styles.container}>
      
      {education.map((edu) => (
        <div key={edu.id} className={styles.item}>
          <div className={styles.institution}>{edu.institution}</div>
          <div className={styles.degree}>
            {edu.degree}, {edu.specialty}
          </div>
          <div className={styles.period}>
            {edu.startDate} – {edu.isCurrently ? "наст. вр." : edu.graduationYear}
          </div>
        </div>
      ))}
    </div>
  )
}
