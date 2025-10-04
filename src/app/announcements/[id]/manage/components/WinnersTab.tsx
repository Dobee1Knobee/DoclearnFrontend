"use client"

import { useState } from "react"
import type { ConferenceWithManagement } from "@/entities/announcement/model/conference-management"
import styles from "./WinnersTab.module.css"

interface WinnersTabProps {
  conference: ConferenceWithManagement
}

export default function WinnersTab({ conference }: WinnersTabProps) {
  const [participants, setParticipants] = useState(conference.participants)
  const winners = participants.filter((p) => p.isWinner)

  const handleRemoveWinner = (participantId: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, isWinner: false } : p)))
  }

  if (winners.length === 0) {
    return (
      <div className={styles.placeholder}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 8L36.944 22.528L52 24.472L40.472 34.528L44.416 50L32 41.472L19.584 50L23.528 34.528L12 24.472L27.056 22.528L32 8Z"
            fill="#d1d5db"
            stroke="#d1d5db"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3>Нет победителей</h3>
        <p>Назначьте победителей в разделе "Участники"</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.winnersList}>
        {winners.map((winner) => (
          <div key={winner.id} className={styles.winnerCard}>
            <div className={styles.winnerHeader}>
              <div className={styles.winnerIcon}>★</div>
              <div className={styles.winnerInfo}>
                <h4 className={styles.winnerName}>{winner.participantName}</h4>
                <p className={styles.winnerEmail}>{winner.participantEmail}</p>
              </div>
            </div>

            <p className={styles.talkTitle}>{winner.talkTitle}</p>

            <button className={styles.removeButton} onClick={() => handleRemoveWinner(winner.id)}>
              Убрать из победителей
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
