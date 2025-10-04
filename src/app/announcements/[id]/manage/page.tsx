"use client"

import { use } from "react"
import { getConferenceById } from "./mockData"
import ConferenceHeader from "./components/ConferenceHeader"
import ManagementTabs from "./components/ManagementTabs"
import styles from "./page.module.css"

export default function ManageAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const conference = getConferenceById(id)

  if (!conference) {
    return (
      <div className={styles.notFound}>
        <h1>Объявление не найдено</h1>
        <p>Конференция с ID {id} не существует или была удалена.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ConferenceHeader conference={conference} />
      <ManagementTabs conference={conference} />
    </div>
  )
}
