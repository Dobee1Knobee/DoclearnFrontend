'use client';

import React from 'react';
import type { Education } from '@/entities/user/model/types';
import styles from './EducationTab.module.css';

interface EducationTabProps {
  education: Education[];
}

export const EducationTab: React.FC<EducationTabProps> = ({ education }) => {
  if (!education.length) {
    return <div className={styles.empty}>Образование не указано</div>;
  }

  return (
    <div className={styles.container}>
      {education.map((edu) => (
        <div key={edu.id} className={styles.item}>
          <div className={styles.institution}>{edu.institution}</div>
          <div className={styles.degree}>
            {edu.degree}, {edu.fieldOfStudy}
          </div>
          <div className={styles.period}>
            {new Date(edu.startDate).getFullYear()} –{' '}
            {edu.endDate ? new Date(edu.endDate).getFullYear() : 'наст. вр.'}
          </div>
        </div>
      ))}
    </div>
  );
};
