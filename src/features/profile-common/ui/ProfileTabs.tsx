'use client'

import React, { useState } from 'react'
import type { AuthorProfile } from '@/entities/user/model/types'
import styles from './ProfileTabs.module.css'
import { OverviewTab } from './OverviewTab/OverviewTab'
import { PublicationsTab } from './PublicationsTab/PublicationsTab'
import { CasesTab } from './CasesTab/CasesTab'
import { CoursesTab } from './CoursesTab/CoursesTab'
import { EducationTab } from './EducationTab/EducationTab'
import { ContactsTab } from './ContactsTab/ContactsTab'

const tabs = [
  { id: 'overview' as const, label: 'Обзор' },
  { id: 'publications' as const, label: 'Публикации' },
  { id: 'cases' as const, label: 'Кейсы' },
  { id: 'courses' as const, label: 'Курсы' },
  { id: 'education' as const, label: 'Образование' },
  { id: 'contacts' as const, label: 'Контакты' },
];

interface ProfileTabsProps {
  profile: AuthorProfile;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} />
      case 'publications':
        return <PublicationsTab profile={profile} />
      case 'cases':
        return <CasesTab profile={profile} />
      case 'courses':
        return <CoursesTab profile={profile} />
      case 'education':
        return <EducationTab education={profile.education} />
      case 'contacts':
        return <ContactsTab profile={profile} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  )
}
