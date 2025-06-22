'use client';

import React from 'react';
import type { AuthorProfile } from '@/entities/user/model/types';
import { VerifiedBadge } from '@/shared/ui/VerifiedBadge/VerifiedBadge';
import {
  MapPin,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profile: AuthorProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const {
    avatar,
    firstName,
    lastName,
    specialization,
    location,
    experience,
    placeWork,
    followers,
    following,
    rating,
    isVerified,
  } = profile;

  const fullName = `${firstName} ${lastName}`;

  const specItems = [
    specialization?.main,
    specialization?.additional,
    specialization?.category,
  ].filter(Boolean);
  const specText = specItems.join(', ');

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={avatar} alt={fullName} className={styles.avatar} />
      </div>
      <div className={styles.center}>
        <h1 className={styles.name}>
          {fullName} 
          {isVerified && <VerifiedBadge className={styles.verifiedIcon} />} 
        </h1>
        {specText && <div className={styles.specialization}>{specText}</div>}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <MapPin size={16} className={styles.metaIcon} />
            <span className={styles.metaText}>{location}</span>
          </div>
          <div className={styles.metaItem}>
            <Briefcase size={16} className={styles.metaIcon} />
            <span className={styles.metaText}>{experience}</span>
          </div>
          <div className={styles.metaItem}>
            <GraduationCap size={16} className={styles.metaIcon} />
            <span className={styles.metaText}>{placeWork}</span>
          </div>
        </div>
      </div>
      {/* <div className={styles.right}> */}
        <div className={styles.statsBlock}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{followers}</span>
            <span className={styles.statLabel}>Подписчики</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{following}</span>
            <span className={styles.statLabel}>Подписки</span>
          </div>
          <div className={`${styles.stat} ${styles.tooltipWrapper}`}>
            <span className={styles.statValueBlue}>{rating}</span>
            <span className={styles.statLabel}>ELO рейтинг</span>
            <div className={styles.tooltipText}>Рейтинг врачей пока в разработке</div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={() => { }}> 
            Редактировать
          </button>
          {/* <button className={styles.primaryButton} onClick={() => { }}>
            Записаться на приём
          </button> */}
        </div>
      </div>
    // </div>
  );
};
