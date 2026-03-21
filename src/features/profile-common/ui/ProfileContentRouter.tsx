"use client"

import type React from "react"
import type { SpecialistUser } from "@/entities/user/model/types"
import { OverviewTab } from "./OverviewTab/OverviewTab"
import { PublicationsTab } from "./PublicationsTab/PublicationsTab"
import { CasesTab } from "./CasesTab/CasesTab"
import { EducationTab } from "./EducationTab/EducationTab"
import { DocumentsTab } from "./DocumentsTab/DocumentsTab"
import styles from "./ProfileContentRouter.module.css"

interface ProfileContentRouterProps {
  profile: SpecialistUser
  activeTab: string
}

export const ProfileContentRouter: React.FC<ProfileContentRouterProps> = ({ profile, activeTab }) => {
  const getEducationArray = () => {
    if (!profile.education) return []
    return Array.isArray(profile.education) ? profile.education : [profile.education]
  }

  const renderContent = () => {
    switch (activeTab) {
      case "publications":
        return <PublicationsTab profile={profile} />
      case "cases":
        if (
          profile.role === "doctor" ||
          profile.role === "admin" ||
          profile.role === "researcher" ||
          profile.role === "owner"
        ) {
          return <CasesTab profile={profile} />
        }
        return <OverviewTab profile={profile} />
      case "education":
        return <EducationTab education={getEducationArray()} />
      case "documents":
        return <DocumentsTab profile={profile} />
      case "overview":
      default:
        return <OverviewTab profile={profile} />
    }
  }

  return (
    <div className={styles.content}>
      {renderContent()}
    </div>
  )
}
