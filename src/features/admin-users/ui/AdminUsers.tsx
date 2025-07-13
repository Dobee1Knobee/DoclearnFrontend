"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Eye, Edit, Ban, Users, CheckCircle } from "lucide-react"
import styles from "./AdminUsers.module.css"

const mockUsers = [
  {
    id: "1",
    firstName: "Анна",
    lastName: "Петрова",
    email: "anna.petrova@example.com",
    avatar: "/Avatars/Avatar1.webp",
    role: "doctor" as const,
    status: "active" as const,
    isVerified: { doctor: true, user: true, student: false },
    createdAt: "2024-01-15",
    lastActive: "2024-01-20",
  },
  {
    id: "2",
    firstName: "Михаил",
    lastName: "Иванов",
    email: "mikhail.ivanov@example.com",
    avatar: "/Avatars/Avatar2.webp",
    role: "student" as const,
    status: "active" as const,
    isVerified: { doctor: false, user: true, student: true },
    createdAt: "2024-01-10",
    lastActive: "2024-01-19",
  },
  {
    id: "3",
    firstName: "Елена",
    lastName: "Сидорова",
    email: "elena.sidorova@example.com",
    avatar: "/Avatars/Avatar3.webp",
    role: "doctor" as const,
    status: "blocked" as const,
    isVerified: { doctor: true, user: true, student: false },
    createdAt: "2024-01-05",
    lastActive: "2024-01-18",
  },
  {
    id: "4",
    firstName: "Дмитрий",
    lastName: "Козлов",
    email: "dmitry.kozlov@example.com",
    avatar: "/Avatars/Avatar4.webp",
    role: "student" as const,
    status: "active" as const,
    isVerified: { doctor: false, user: false, student: false },
    createdAt: "2024-01-12",
    lastActive: "2024-01-21",
  },
  {
    id: "5",
    firstName: "Ольга",
    lastName: "Морозова",
    email: "olga.morozova@example.com",
    avatar: "/Avatars/Avatar5.webp",
    role: "admin" as const,
    status: "active" as const,
    isVerified: { doctor: false, user: true, student: false },
    createdAt: "2023-12-20",
    lastActive: "2024-01-21",
  },
]

type UserRole = "all" | "student" | "doctor" | "admin"
type UserStatus = "all" | "active" | "blocked"

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<UserStatus>("all")

  // const filteredUsers = mockUsers.filter((user) => {
  //   const matchesSearch =
  //     user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesRole = roleFilter === "all" || user.role === roleFilter
  //   const matchesStatus = statusFilter === "all" || user.status === statusFilter

  //   return matchesSearch && matchesRole && matchesStatus
  // })

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "student":
        return styles.roleStudent
      case "doctor":
        return styles.roleDoctor
      case "admin":
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
      case "doctor":
        return "Врач"
      case "admin":
        return "Админ"
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
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const handleViewUser = (userId: string) => {
  }

  const handleEditUser = (userId: string) => {
  }

  const handleBlockUser = (userId: string) => {
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
          <option value="doctor">Врачи</option>
          <option value="admin">Администраторы</option>
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

      {mockUsers.length === 0 ? (
        <div className={styles.placeholder}>
          <Users size={48} className={styles.placeholderIcon} />
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
              {mockUsers.map((user) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.userInfo}>
                      <Image
                        src={user.avatar || "/placeholder.svg"}
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
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {(user.isVerified.doctor || user.isVerified.user || user.isVerified.student) && (
                      <CheckCircle size={16} className={styles.verifiedIcon} />
                    )}
                  </td>
                  <td className={styles.tableCell}>{formatDate(user.createdAt)}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        title="Просмотреть профиль"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className={`${styles.actionButton} ${styles.blockButton}`}
                        title={user.status === "blocked" ? "Разблокировать" : "Заблокировать"}
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

      {/* <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Показано {filteredUsers.length} из {mockUsers.length} пользователей
        </span>
      </div> */}
    </div>
  )
}
