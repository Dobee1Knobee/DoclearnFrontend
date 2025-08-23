"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, User, Clock, Check, X, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import {
  useGetPendingUsersQuery,
  useApproveAllChangesMutation,
  useRejectChangesMutation,
  useGetPendingDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
} from "../api/adminModerationApi"
import { AdminModerationSpinner } from "./AdminModerationSpinner"
import { AdminModerationError } from "./AdminModerationError"
import { AdminModerationEmpty } from "./AdminModerationEmpty"
import styles from "./AdminModeration.module.css"
import type { PendingUser, DocumentCategory } from "../model/types"

type ModerationTab = "documents" | "profiles"

const categoryLabels: Record<DocumentCategory, string> = {
  higher_education_diploma: "Диплом о высшем образовании",
  residency_diploma: "Диплом об окончании ординатуры",
  professional_retraining_diploma: "Диплом о проф. переподготовке",
  academic_degree_diploma: "Диплом кандидата/доктора наук",
  accreditation_certificate: "Свидетельство об аккредитации",
  specialist_certificate: "Сертификат специалиста",
  qualification_certificate: "Удостоверение о повышении квалификации",
  medical_license: "Лицензия на мед. деятельность",
  scientific_publication: "Научная публикация / Статья",
  patent: "Патент на изобретение",
  award: "Награда / Грамота",
  recommendation_letter: "Рекомендательное письмо",
  student_id: "Студенческий билет",
  other: "Другое",
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function AdminModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>("profiles")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)

  const router = useRouter()

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetPendingUsersQuery({
    page: currentPage,
  })

  const {
    data: documentsResponse,
    error: documentsError,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useGetPendingDocumentsQuery()

  const [approveChanges, { isLoading: isApproving }] = useApproveAllChangesMutation()
  const [rejectChanges, { isLoading: isRejecting }] = useRejectChangesMutation()
  const [approveDocument, { isLoading: isApprovingDoc }] = useApproveDocumentMutation()
  const [rejectDocument, { isLoading: isRejectingDoc }] = useRejectDocumentMutation()

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

  const handleApprove = async (userId: string, type: string, documentId?: string) => {
    if (type === "profile") {
      try {
        await approveChanges(userId).unwrap()
      } catch (error) {
        console.error("Ошибка при одобрении изменений:", error)
      }
    } else if (type === "document" && documentId) {
      try {
        await approveDocument({ userId, documentId }).unwrap()
      } catch (error) {
        console.error("Ошибка при одобрении документа:", error)
      }
    }
  }

  const handleReject = async (userId: string, type: string, documentId?: string) => {
    if (type === "profile") {
      try {
        await rejectChanges(userId).unwrap()
      } catch (error) {
        console.error("Ошибка при отклонении изменений:", error)
      }
    } else if (type === "document" && documentId) {
      try {
        await rejectDocument({ userId, documentId }).unwrap()
      } catch (error) {
        console.error("Ошибка при отклонении документа:", error)
      }
    }
  }

  const handleView = (userId: string, type: string, documentUrl?: string) => {
    if (type === "profile") {
      router.push(`/profile/${userId}`)
    } else if (type === "document" && documentUrl) {
      setViewingDocument(documentUrl)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRetry = () => {
    refetch()
  }

  const renderDocuments = () => {
    if (documentsLoading) {
      return <AdminModerationSpinner />
    }

    if (documentsError) {
      const errorMessage =
        "data" in documentsError && documentsError.data
          ? (documentsError.data as any)?.message || "Произошла ошибка при загрузке документов"
          : "Произошла ошибка при загрузке документов"

      return <AdminModerationError error={errorMessage} onRetry={refetchDocuments} />
    }

    if (!documentsResponse?.data.length) {
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
        {documentsResponse.data.map((item) => (
          <div key={item.document._id} className={styles.queueItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>
                  {categoryLabels[item.document.category as DocumentCategory]} - {item.userName}
                </h3>
                <div className={styles.itemMeta}>
                  <div className={styles.itemUser}>
                    <span>{item.userName}</span>
                  </div>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button
                  onClick={() => handleView(item.userId, "document", item.documentUrl)}
                  className={`${styles.actionButton} ${styles.viewButton}`}
                >
                  <Eye size={16} />
                  Просмотреть
                </button>
                <button
                  onClick={() => handleApprove(item.userId, "document", item.document._id)}
                  disabled={isApprovingDoc || isRejectingDoc}
                  className={`${styles.actionButton} ${styles.approveButton}`}
                >
                  <Check size={16} />
                  {isApprovingDoc ? "Одобряем..." : "Одобрить"}
                </button>
                <button
                  onClick={() => handleReject(item.userId, "document", item.document._id)}
                  disabled={isApprovingDoc || isRejectingDoc}
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                >
                  <X size={16} />
                  {isRejectingDoc ? "Отклоняем..." : "Отклонить"}
                </button>
              </div>
            </div>
            <div className={styles.itemContent}>
              <div className={styles.contentTitle}>Информация о документе:</div>
              <div className={styles.contentText}>
                <div style={{ marginBottom: "0.25rem" }}>
                  <strong>Файл:</strong> {item.document.file.originalName} ({formatFileSize(item.document.file.size)})
                </div>
                <div style={{ marginBottom: "0.25rem" }}>
                  <strong>Категория:</strong> {categoryLabels[item.document.category as DocumentCategory]}
                </div>
                {item.document.label && (
                  <div style={{ marginBottom: "0.25rem" }}>
                    <strong>Название:</strong> {item.document.label}
                  </div>
                )}
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
                        <span>{user.email}</span>
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
          Документы ({documentsResponse?.data.length || 0})
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

      {viewingDocument && (
        <div className={styles.modal} onClick={() => setViewingDocument(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Просмотр документа</h3>
              <button onClick={() => setViewingDocument(null)} className={styles.modalCloseButton}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <iframe
                src={viewingDocument}
                width="100%"
                height="500"
                style={{ border: "none", borderRadius: "8px" }}
                title="Просмотр документа"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
