"use client"

import { useState } from "react"
import type { ConferenceWithManagement } from "@/entities/announcement/model/conference-management"
import styles from "./ApplicationsTab.module.css"

interface ApplicationsTabProps {
  conference: ConferenceWithManagement
}

export default function ApplicationsTab({ conference }: ApplicationsTabProps) {
  const [applications, setApplications] = useState(conference.applications)

  const pendingApplications = applications.filter((app) => app.status === "pending")

  const handleApprove = (applicationId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId))
    console.log("[v0] Approved application:", applicationId)
  }

  const handleReject = (applicationId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId))
    console.log("[v0] Rejected application:", applicationId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (pendingApplications.length === 0) {
    return (
      <div className={styles.placeholder}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44c-11.028 0-20-8.972-20-20s8.972-20 20-20 20 8.972 20 20-8.972 20-20 20z"
            fill="#d1d5db"
          />
          <path
            d="M32 24c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2s2-.895 2-2V26c0-1.105-.895-2-2-2zm0 20c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"
            fill="#d1d5db"
          />
        </svg>
        <h3>Нет заявок на рассмотрении</h3>
        <p>Все заявки были обработаны или пока не поступило ни одной заявки</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.applicationsList}>
        {pendingApplications.map((application) => (
          <div key={application.id} className={styles.applicationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.participantInfo}>
                <h3 className={styles.participantName}>{application.participantName}</h3>
                <p className={styles.participantEmail}>{application.participantEmail}</p>
              </div>
              <div className={styles.submittedDate}>
                {new Date(application.submittedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className={styles.talkInfo}>
              <h4 className={styles.talkTitle}>{application.talkTitle}</h4>
              <p className={styles.abstract}>{application.abstract}</p>
            </div>

            {application.attachedFiles.length > 0 && (
              <div className={styles.filesSection}>
                <div className={styles.filesLabel}>Прикрепленные файлы:</div>
                <div className={styles.filesList}>
                  {application.attachedFiles.map((file) => (
                    <a key={file.id} href={file.url} className={styles.fileItem} download>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M9.333 1.333H4a1.333 1.333 0 00-1.333 1.334v10.666A1.333 1.333 0 004 14.666h8a1.333 1.333 0 001.333-1.333V5.333L9.333 1.333z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.333 1.333v4h4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.rejectButton} onClick={() => handleReject(application.id)}>
                Отклонить
              </button>
              <button className={styles.approveButton} onClick={() => handleApprove(application.id)}>
                Одобрить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
