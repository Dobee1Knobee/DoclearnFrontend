"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FileText, User, Clock, Check, X, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import {
  useGetPendingUsersQuery,
  useApproveAllChangesMutation,
  useRejectChangesMutation,
} from "../api/adminModerationApi"
import { AdminModerationSpinner } from "./AdminModerationSpinner"
import { AdminModerationError } from "./AdminModerationError"
import { AdminModerationEmpty } from "./AdminModerationEmpty"
import styles from "./AdminModeration.module.css"
import type { PendingUser } from "../model/types"

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

export function AdminModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>("profiles")
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetPendingUsersQuery({
    page: currentPage,
  })

  const [approveChanges, { isLoading: isApproving }] = useApproveAllChangesMutation()
  const [rejectChanges, { isLoading: isRejecting }] = useRejectChangesMutation()

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
      firstName: "Имя",
      lastName: "Фамилия",
      middleName: "Отчество",
      specialization: "Специализация",
      placeWork: "Место работы",
      experience: "Опыт работы",
    }
    return labels[field] || field
  }

  const handleApprove = async (userId: string, type: string) => {
    if (type === "profile") {
      try {
        await approveChanges(userId).unwrap()
        // Карточка автоматически исчезнет из списка благодаря invalidatesTags
      } catch (error) {
        console.error("Ошибка при одобрении изменений:", error)
      }
    }
  }

  const handleReject = async (userId: string, type: string) => {
    if (type === "profile") {
      try {
        await rejectChanges(userId).unwrap()
        // Карточка автоматически исчезнет из списка благодаря invalidatesTags
      } catch (error) {
        console.error("Ошибка при отклонении изменений:", error)
        // В будущем здесь можно показать уведомление об ошибке
      }
    }
  }

  const handleView = (userId: string, type: string) => {
    if (type === "profile") {
      router.push(`/profile/${userId}`)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRetry = () => {
    refetch()
  }

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
    if (isLoading) {
      return <AdminModerationSpinner />
    }

    if (error) {
      const errorMessage =
        "data" in error && error.data
          ? (error.data as any)?.message || "Произошла ошибка при загрузке данных модерации"
          : "Произошла ошибка при загрузке данных модерации"

      return <AdminModerationError error={errorMessage} onRetry={handleRetry} />
    }

    if (!response?.data.users.length) {
      return <AdminModerationEmpty />
    }

    return (
      <>
        <div className={styles.queueList}>
          {response.data.users.map((user: PendingUser) => {
            const changedFields = Object.keys(user.pendingChanges.data)
            const changes = Object.entries(user.pendingChanges.data).reduce(
              (acc, [key, value]) => {
                acc[key] = value.value
                return acc
              },
              {} as Record<string, string>,
            )

            return (
              <div key={user._id} className={styles.queueItem}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>
                      Изменения профиля - {user.firstName} {user.lastName}
                    </h3>
                    <div className={styles.itemMeta}>
                      <div className={styles.itemUser}>
                        {/* <Image
                          src={user.avatar || user.defaultAvatarPath || "/placeholder.webp"}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={24}
                          height={24}
                          className={styles.userAvatar}
                        /> */}
                        <span>
                          {user.email}
                          {/* {user.firstName} {user.lastName} */}
                        </span>
                      </div>
                      <div className={styles.itemDate}>
                        <Clock size={14} />
                        <span>{formatDate(user.pendingChanges.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleView(user._id, "profile")}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                    >
                      <Eye size={16} />
                      Просмотреть
                    </button>
                    <button
                      onClick={() => handleApprove(user._id, "profile")}
                      disabled={isApproving || isRejecting}
                      className={`${styles.actionButton} ${styles.approveButton}`}
                    >
                      <Check size={16} />
                      {isApproving ? "Одобряем..." : "Одобрить"}
                    </button>
                    <button
                      onClick={() => handleReject(user._id, "profile")}
                      disabled={isApproving || isRejecting}
                      className={`${styles.actionButton} ${styles.rejectButton}`}
                    >
                      <X size={16} />
                      {isRejecting ? "Отклоняем..." : "Отклонить"}
                    </button>
                  </div>
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.contentTitle}>Измененные поля:</div>
                  <div className={styles.fieldsList}>
                    {changedFields.map((field) => (
                      <span key={field} className={styles.fieldBadge}>
                        {getFieldLabel(field)}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: "0.75rem" }}>
                    <div className={styles.contentText}>
                      {Object.entries(changes).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: "0.25rem" }}>
                          <strong>{getFieldLabel(key)}:</strong> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {response && response.data.totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Показано {response.data.users.length} из {response.data.total} пользователей
            </div>
            <div className={styles.paginationControls}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                <ChevronLeft size={16} />
                Назад
              </button>

              <div className={styles.paginationNumbers}>
                {Array.from({ length: response.data.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.paginationNumber} ${page === currentPage ? styles.paginationNumberActive : ""}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === response.data.totalPages}
                className={styles.paginationButton}
              >
                Вперед
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </>
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
          Профили ({response?.data.total || 0})
        </button>
      </div>

      <div className={styles.content}>{activeTab === "documents" ? renderDocuments() : renderProfiles()}</div>
    </div>
  )
}
