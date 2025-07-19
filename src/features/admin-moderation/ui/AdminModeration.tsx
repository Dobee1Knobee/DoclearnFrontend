"use client"

import { useState } from "react"
import Image from "next/image"
import { FileText, User, Clock, Check, X, Eye } from "lucide-react"
import styles from "./AdminModeration.module.css"

type ModerationTab = "documents" | "profiles"

const mockDocuments = [
  {
    id: "1",
    type: "document",
    title: "Диплом врача - Анна Петрова",
    user: {
      id: "1",
      name: "Анна Петрова",
      avatar: "/Avatars/Avatar1.webp",
      defaultAvatarPath: "/Avatars/Avatar1.webp",
    },
    submittedAt: "2024-01-20T10:30:00Z",
    fileName: "diploma_petrova.pdf",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    type: "document",
    title: "Сертификат специалиста - Михаил Иванов",
    user: {
      id: "2",
      name: "Михаил Иванов",
      avatar: "/Avatars/Avatar2.webp",
      defaultAvatarPath: "/Avatars/Avatar2.webp",
    },
    submittedAt: "2024-01-19T15:45:00Z",
    fileName: "certificate_ivanov.pdf",
    fileSize: "1.8 MB",
  },
]

const mockProfiles = [
  {
    id: "1",
    type: "profile",
    title: "Изменения профиля - Елена Сидорова",
    user: {
      id: "3",
      name: "Елена Сидорова",
      avatar: "/Avatars/Avatar3.webp",
      defaultAvatarPath: "/Avatars/Avatar3.webp",
    },
    submittedAt: "2024-01-21T09:15:00Z",
    changes: {
      specialization: "Кардиология, Терапия",
      placeWork: "Городская больница №5",
      experience: "8 лет в кардиологии",
    },
    changedFields: ["specialization", "placeWork", "experience"],
  },
  {
    id: "2",
    type: "profile",
    title: "Изменения профиля - Дмитрий Козлов",
    user: {
      id: "4",
      name: "Дмитрий Козлов",
      avatar: "/Avatars/Avatar4.webp",
      defaultAvatarPath: "/Avatars/Avatar4.webp",
    },
    submittedAt: "2024-01-20T14:20:00Z",
    changes: {
      firstName: "Дмитрий",
      lastName: "Петров",
    },
    changedFields: ["firstName", "lastName"],
  },
]

export function AdminModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>("documents")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      specialization: "Специализация",
      placeWork: "Место работы",
      experience: "Опыт работы",
      firstName: "Имя",
      lastName: "Фамилия",
    }
    return labels[field] || field
  }
  const handleApprove = (id: string, type: string) => {}
  const handleReject = (id: string, type: string) => {}
  const handleView = (id: string, type: string) => {}

  const renderDocuments = () => {
    if (mockDocuments.length === 0) {
      return (
        <div className={styles.placeholder}>
          <FileText size={48} className={styles.placeholderIcon} />
          <h3 className={styles.placeholderTitle}>Нет документов на модерации</h3>
          <p className={styles.placeholderText}>Все загруженные документы проверены</p>
        </div>
      )
    }

    return (
      <div className={styles.queueList}>
        {mockDocuments.map((item) => (
          <div key={item.id} className={styles.queueItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <div className={styles.itemMeta}>
                  <div className={styles.itemUser}>
                    <Image
                      src={item.user.avatar || item.user.defaultAvatarPath}
                      alt={item.user.name}
                      width={24}
                      height={24}
                      className={styles.userAvatar}
                    />
                    <span>{item.user.name}</span>
                  </div>
                  <div className={styles.itemDate}>
                    <Clock size={14} />
                    <span>{formatDate(item.submittedAt)}</span>
                  </div>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button
                  onClick={() => handleView(item.id, "document")}
                  className={`${styles.actionButton} ${styles.viewButton}`}
                >
                  <Eye size={16} />
                  Просмотреть
                </button>
                <button
                  onClick={() => handleApprove(item.id, "document")}
                  className={`${styles.actionButton} ${styles.approveButton}`}
                >
                  <Check size={16} />
                  Одобрить
                </button>
                <button
                  onClick={() => handleReject(item.id, "document")}
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                >
                  <X size={16} />
                  Отклонить
                </button>
              </div>
            </div>
            <div className={styles.itemContent}>
              <div className={styles.contentTitle}>Информация о файле:</div>
              <div className={styles.contentText}>
                Файл: {item.fileName} ({item.fileSize})
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderProfiles = () => {
    if (mockProfiles.length === 0) {
      return (
        <div className={styles.placeholder}>
          <User size={48} className={styles.placeholderIcon} />
          <h3 className={styles.placeholderTitle}>Нет изменений профилей на модерации</h3>
          <p className={styles.placeholderText}>Все изменения профилей проверены</p>
        </div>
      )
    }

    return (
      <div className={styles.queueList}>
        {mockProfiles.map((item) => (
          <div key={item.id} className={styles.queueItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <div className={styles.itemMeta}>
                  <div className={styles.itemUser}>
                    <Image
                      src={item.user.avatar || item.user.defaultAvatarPath}
                      alt={item.user.name}
                      width={24}
                      height={24}
                      className={styles.userAvatar}
                    />
                    <span>{item.user.name}</span>
                  </div>
                  <div className={styles.itemDate}>
                    <Clock size={14} />
                    <span>{formatDate(item.submittedAt)}</span>
                  </div>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button
                  onClick={() => handleView(item.id, "profile")}
                  className={`${styles.actionButton} ${styles.viewButton}`}
                >
                  <Eye size={16} />
                  Просмотреть
                </button>
                <button
                  onClick={() => handleApprove(item.id, "profile")}
                  className={`${styles.actionButton} ${styles.approveButton}`}
                >
                  <Check size={16} />
                  Одобрить
                </button>
                <button
                  onClick={() => handleReject(item.id, "profile")}
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                >
                  <X size={16} />
                  Отклонить
                </button>
              </div>
            </div>
            <div className={styles.itemContent}>
              <div className={styles.contentTitle}>Измененные поля:</div>
              <div className={styles.fieldsList}>
                {item.changedFields.map((field) => (
                  <span key={field} className={styles.fieldBadge}>
                    {getFieldLabel(field)}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <div className={styles.contentText}>
                  {Object.entries(item.changes).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: "0.25rem" }}>
                      <strong>{getFieldLabel(key)}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Модерация</h1>
        <p className={styles.subtitle}>Проверка и одобрение документов и изменений профилей</p>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("documents")}
          className={`${styles.tab} ${activeTab === "documents" ? styles.active : ""}`}
        >
          <FileText size={16} />
          Документы ({mockDocuments.length})
        </button>
        <button
          onClick={() => setActiveTab("profiles")}
          className={`${styles.tab} ${activeTab === "profiles" ? styles.active : ""}`}
        >
          <User size={16} />
          Профили ({mockProfiles.length})
        </button>
      </div>

      <div className={styles.content}>{activeTab === "documents" ? renderDocuments() : renderProfiles()}</div>
    </div>
  )
}
