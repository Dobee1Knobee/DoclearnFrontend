"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Eye, Edit, Ban, ChevronLeft, ChevronRight } from "lucide-react"
import { useGetAdminUsersQuery } from "../api/adminUsersApi"
import { AdminUsersSpinner } from "./AdminUsersSpinner"
import { AdminUsersError } from "./AdminUsersError"
import { AdminUsersEmpty } from "./AdminUsersEmpty"
import styles from "./AdminUsers.module.css"
import type { SpecialistUser } from "@/entities/user/model/types"
import { VerificationIcons } from "./VerificationIcons"
import Link from "next/link"

type UserRole = "all" | "student" | "resident" | "postgraduate" | "doctor" | "researcher" | "admin" | "owner"
type UserStatus = "all" | "active" | "blocked"

export function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<UserStatus>("all")

  const router = useRouter()

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetAdminUsersQuery({
    page: currentPage,
  })

  const filteredUsers =
    response?.data.users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || statusFilter === "active"

      return matchesSearch && matchesRole && matchesStatus
    }) || []

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "student":
        return styles.roleStudent
      case "resident":
        return styles.roleStudent
      case "postgraduate":
        return styles.roleDoctor
      case "doctor":
        return styles.roleDoctor
      case "researcher":
        return styles.roleDoctor
      case "admin":
        return styles.roleAdmin
      case "owner":
        return styles.roleAdmin
      default:
        return styles.roleStudent
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return styles.statusActive
      case "blocked":
        return styles.statusBlocked
      default:
        return styles.statusActive
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "Студент"
      case "resident":
        return "Ординатор"
      case "postgraduate":
        return "Аспирант"
      case "doctor":
        return "Врач"
      case "researcher":
        return "Научный сотрудник"
      case "admin":
        return "Админ"
      case "owner":
        return "Владелец"
      default:
        return role
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активен"
      case "blocked":
        return "Заблокирован"
      default:
        return "Активен"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const handleViewUser = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const handleEditUser = (_userId: string) => {}

  const handleBlockUser = (_userId: string) => {}

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRetry = () => {
    refetch()
  }

  if (isLoading) {
    return <AdminUsersSpinner />
  }

  if (error) {
    const errorMessage =
      "data" in error && error.data
        ? (error.data as any)?.message || "Произошла ошибка при загрузке пользователей"
        : "Произошла ошибка при загрузке пользователей"

    return <AdminUsersError error={errorMessage} onRetry={handleRetry} />
  }

  if (!response?.data.users.length) {
    return <AdminUsersEmpty />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление пользователями</h1>
          <p className={styles.subtitle}>Просмотр и управление пользователями системы</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
            }}
          />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole)}
          className={styles.filterSelect}
        >
          <option value="all">Все роли</option>
          <option value="student">Студенты</option>
          <option value="resident">Ординаторы</option>
          <option value="postgraduate">Аспиранты</option>
          <option value="doctor">Врачи</option>
          <option value="researcher">Научные сотрудники</option>
          <option value="admin">Администраторы</option>
          <option value="owner">Владельцы</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
          className={styles.filterSelect}
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className={styles.placeholder}>
          <Search size={48} className={styles.placeholderIcon} />
          <h3 className={styles.placeholderTitle}>Пользователи не найдены</h3>
          <p className={styles.placeholderText}>Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Пользователь</th>
                <th className={styles.tableHeaderCell}>Роль</th>
                <th className={styles.tableHeaderCell}>Статус</th>
                <th className={styles.tableHeaderCell}>Верификация</th>
                <th className={styles.tableHeaderCell}>Дата регистрации</th>
                <th className={styles.tableHeaderCell}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: SpecialistUser) => (
                <tr key={user._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.userInfo}>
                      <Image
                        src={user.avatar || user.defaultAvatarPath || "/placeholder.webp"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={40}
                        height={40}
                        className={styles.avatar}
                      />
                      <div>
                        <p className={styles.userName}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass("active")}`}>
                      {getStatusLabel("active")}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <VerificationIcons isVerified={user.isVerified} className={styles.verificationIcons} />
                  </td>
                  <td className={styles.tableCell}>{formatDate(user.createdAt)}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actions}>
                      {/* <button
                        onClick={() => handleViewUser(user._id)}
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        title="Просмотреть профиль"
                      >
                        <Eye size={16} />
                      </button> */}
                      <Link href={`/profile/${encodeURIComponent(user._id)}`} className={`${styles.actionButton} ${styles.viewButton}`} title="Просмотреть профиль" prefetch>
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleEditUser(user._id)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user._id)}
                        className={`${styles.actionButton} ${styles.blockButton}`}
                        title="Заблокировать"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {response && response.data.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Показано {filteredUsers.length} из {response.data.total} пользователей
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
    </div>
  )
}
