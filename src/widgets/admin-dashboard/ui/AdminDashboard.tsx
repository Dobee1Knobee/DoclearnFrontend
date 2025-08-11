"use client"

import { useState } from "react"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { BarChart3, Users, Shield, Settings, TrendingUp, ShieldAlert, ArrowLeft } from "lucide-react"
import { AdminUsers } from "@/features/admin-users/ui/AdminUsers"
import { AdminModeration } from "@/features/admin-moderation/ui/AdminModeration"
import { AdminPlaceholder } from "@/shared/ui/AdminPlaceholder/AdminPlaceholder"
import styles from "./AdminDashboard.module.css"
import Link from "next/link"

type AdminSection = "overview" | "users" | "moderation" | "settings" | "analytics"

const navigationItems = [
  {
    id: "overview" as AdminSection,
    label: "Обзор",
    icon: BarChart3,
  },
  {
    id: "users" as AdminSection,
    label: "Управление пользователями",
    icon: Users,
  },
  {
    id: "moderation" as AdminSection,
    label: "Модерация",
    icon: Shield,
  },
  {
    id: "settings" as AdminSection,
    label: "Настройки системы",
    icon: Settings,
  },
  {
    id: "analytics" as AdminSection,
    label: "Аналитика",
    icon: TrendingUp,
  },
]

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview")
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated || !user || user.role !== "admin" ) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.accessDenied}>
            <ShieldAlert size={64} className={styles.accessDeniedIcon} />
            <h2 className={styles.accessDeniedTitle}>Доступ запрещен</h2>
            <p className={styles.accessDeniedText}>У вас нет прав для доступа к административной панели</p>
            <Link href="/" className={styles.backButton}>
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminPlaceholder title="Обзор" description="Раздел находится в разработке" />
      case "users":
        return <AdminUsers />
      case "moderation":
        return <AdminModeration />
      case "settings":
        return <AdminPlaceholder title="Настройки системы" description="Раздел находится в разработке" />
      case "analytics":
        return <AdminPlaceholder title="Аналитика" description="Раздел находится в разработке" />
      default:
        return <AdminPlaceholder title="Обзор" description="Раздел находится в разработке" />
    }
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>
          <ShieldAlert className={styles.sidebarIcon} />
          Админ-панель
        </h1>
        <nav className={styles.nav}>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ""}`}
              >
                <Icon size={20} className={styles.navIcon} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className={styles.content}>{renderContent()}</main>
    </div>
  )
}
