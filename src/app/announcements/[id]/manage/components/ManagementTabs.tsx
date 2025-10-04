"use client"

import { useState } from "react"
import type { ConferenceWithManagement } from "@/entities/announcement/model/conference-management"
import ApplicationsTab from "./ApplicationsTab"
import ParticipantsTab from "./ParticipantsTab"
import WinnersTab from "./WinnersTab"
import styles from "./ManagementTabs.module.css"

interface ManagementTabsProps {
  conference: ConferenceWithManagement
}

type TabType = "applications" | "participants" | "winners"

export default function ManagementTabs({ conference }: ManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("applications")

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "applications" ? styles.active : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Заявки на рассмотрении
          {conference.applications.filter((app) => app.status === "pending").length > 0 && (
            <span className={styles.badge}>
              {conference.applications.filter((app) => app.status === "pending").length}
            </span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "participants" ? styles.active : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          Участники
          <span className={styles.badge}>{conference.participants.length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === "winners" ? styles.active : ""}`}
          onClick={() => setActiveTab("winners")}
        >
          Победители
          <span className={styles.badge}>{conference.participants.filter((p) => p.isWinner).length}</span>
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "applications" && <ApplicationsTab conference={conference} />}
        {activeTab === "participants" && <ParticipantsTab conference={conference} />}
        {activeTab === "winners" && <WinnersTab conference={conference} />}
      </div>
    </div>
  )
}
