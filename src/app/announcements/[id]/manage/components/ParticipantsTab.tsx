"use client"

import { useState } from "react"
import type { ConferenceWithManagement, ConferenceParticipant } from "@/entities/announcement/model/conference-management"
import styles from "./ParticipantsTab.module.css"

interface ParticipantsTabProps {
  conference: ConferenceWithManagement
}

export default function ParticipantsTab({ conference }: ParticipantsTabProps) {
  const [participants, setParticipants] = useState(conference.participants)
  const hasStages = conference.stages && conference.stages.length > 0

  const handleMoveForward = (participantId: string) => {
    if (!conference.stages) return

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p

        const currentStageIndex = conference.stages!.findIndex((s) => s.id === p.currentStageId)
        if (currentStageIndex === -1 || currentStageIndex === conference.stages!.length - 1) return p

        const nextStage = conference.stages![currentStageIndex + 1]
        return { ...p, currentStageId: nextStage.id }
      }),
    )
  }

  const handleMoveBackward = (participantId: string) => {
    if (!conference.stages) return

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p

        const currentStageIndex = conference.stages!.findIndex((s) => s.id === p.currentStageId)
        if (currentStageIndex <= 0) return p

        const prevStage = conference.stages![currentStageIndex - 1]
        return { ...p, currentStageId: prevStage.id }
      }),
    )
  }

  const handleToggleWinner = (participantId: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, isWinner: !p.isWinner } : p)))
  }

  if (participants.length === 0) {
    return (
      <div className={styles.placeholder}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44c-11.028 0-20-8.972-20-20s8.972-20 20-20 20 8.972 20 20-8.972 20-20 20z"
            fill="#d1d5db"
          />
          <path
            d="M32 20c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z"
            fill="#d1d5db"
          />
        </svg>
        <h3>Нет участников</h3>
        <p>Одобрите заявки, чтобы участники появились в этом разделе</p>
      </div>
    )
  }

  if (hasStages) {
    return (
      <div className={styles.kanbanContainer}>
        {conference.stages!.map((stage) => {
          const stageParticipants = participants.filter((p) => p.currentStageId === stage.id)

          return (
            <div key={stage.id} className={styles.stageColumn}>
              <div className={styles.stageHeader}>
                <h3 className={styles.stageName}>{stage.name}</h3>
                <div className={styles.stageInfo}>
                  <span className={styles.stageDate}>
                    {new Date(stage.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className={styles.stageCount}>
                    {stageParticipants.length}
                    {stage.maxParticipants && ` / ${stage.maxParticipants}`}
                  </span>
                </div>
              </div>

              <div className={styles.participantsList}>
                {stageParticipants.length === 0 ? (
                  <div className={styles.emptyStage}>Нет участников</div>
                ) : (
                  stageParticipants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={participant}
                      stages={conference.stages!}
                      onMoveForward={handleMoveForward}
                      onMoveBackward={handleMoveBackward}
                      onToggleWinner={handleToggleWinner}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.participantsList}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            stages={[]}
            onMoveForward={handleMoveForward}
            onMoveBackward={handleMoveBackward}
            onToggleWinner={handleToggleWinner}
          />
        ))}
      </div>
    </div>
  )
}

interface ParticipantCardProps {
  participant: ConferenceParticipant
  stages: Array<{ id: string; name: string; order: number }>
  onMoveForward: (id: string) => void
  onMoveBackward: (id: string) => void
  onToggleWinner: (id: string) => void
}

function ParticipantCard({ participant, stages, onMoveForward, onMoveBackward, onToggleWinner }: ParticipantCardProps) {
  const hasStages = stages.length > 0
  const currentStageIndex = stages.findIndex((s) => s.id === participant.currentStageId)
  const isFirstStage = currentStageIndex === 0
  const isLastStage = currentStageIndex === stages.length - 1

  return (
    <div className={styles.participantCard}>
      <div className={styles.participantHeader}>
        <h4 className={styles.participantName}>{participant.participantName}</h4>
        {participant.isWinner && <span className={styles.winnerBadge}>Победитель</span>}
      </div>

      <p className={styles.participantEmail}>{participant.participantEmail}</p>
      <p className={styles.talkTitle}>{participant.talkTitle}</p>

      <div className={styles.participantActions}>
        {hasStages && (
          <div className={styles.moveButtons}>
            <button
              className={styles.moveButton}
              onClick={() => onMoveBackward(participant.id)}
              disabled={isFirstStage}
              title="Переместить назад"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.moveButton}
              onClick={() => onMoveForward(participant.id)}
              disabled={isLastStage}
              title="Переместить вперед"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        <button className={styles.winnerButton} onClick={() => onToggleWinner(participant.id)}>
          {participant.isWinner ? "★" : "☆"}
        </button>
      </div>
    </div>
  )
}
