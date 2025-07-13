"use client"

import type React from "react"
import { useState } from "react"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import styles from "./ProfileTabs.module.css"
import { OverviewTab } from "./OverviewTab/OverviewTab"
import { PublicationsTab } from "./PublicationsTab/PublicationsTab"
import { CasesTab } from "./CasesTab/CasesTab"
import { EducationTab } from "./EducationTab/EducationTab"
import { ContactsTab } from "./ContactsTab/ContactsTab"
import { DocumentsTab } from "./DocumentsTab/DocumentsTab"

interface ProfileTabsProps {
  profile: AuthorProfile | StudentProfile;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<string>("overview")

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "overview", label: "Обзор" },
      { id: "publications", label: "Публикации" },
    ]

    if (profile.role === "doctor" || profile.role === "admin") {
      baseTabs.push({ id: "cases", label: "Кейсы" })
    }
    
    baseTabs.push(
      { id: "education", label: "Образование" },
      { id: "contacts", label: "Контакты" },
      { id: "documents", label: "Документы" },
    )

    return baseTabs
  }

  const availableTabs = getAvailableTabs()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} />
      case 'publications':
        return <PublicationsTab profile={profile} />
      case 'cases':
        if (profile.role === "doctor" || profile.role === "admin") {
          return <CasesTab profile={profile as AuthorProfile} />
        }
        return null
      case 'education':
        return <EducationTab education={profile.education} />
      case 'contacts':
        return <ContactsTab contacts={profile.contacts} />
      case 'documents':
        return <DocumentsTab profile={profile} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsHeader}>
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
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
