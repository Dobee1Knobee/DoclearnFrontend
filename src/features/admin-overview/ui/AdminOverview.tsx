"use client"

import { Users, FileText, Clock, UserCheck, TrendingUp, AlertCircle } from "lucide-react"
import styles from "./AdminOverview.module.css"

const mockMetrics = {
  totalUsers: 2847,
  newUsersWeek: 156,
  newUsersMonth: 623,
  totalPosts: 1234,
  pendingModeration: 23,
  activeUsers: 1456,
}

const mockChanges = {
  totalUsers: { value: 8.2, type: "positive" as const },
  newUsersWeek: { value: 12.5, type: "positive" as const },
  newUsersMonth: { value: 5.7, type: "positive" as const },
  totalPosts: { value: 15.3, type: "positive" as const },
  pendingModeration: { value: 0, type: "neutral" as const },
  activeUsers: { value: 3.1, type: "positive" as const },
}

export function AdminOverview() {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  const renderChange = (change: { value: number; type: "positive" | "neutral" }) => {
    if (change.type === "neutral") {
      return <span className={styles.metricChangeNeutral}>Без изменений</span>
    }

    return (
      <span className={styles.metricChangePositive}>
        <TrendingUp size={16} />+{change.value}%
      </span>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обзор системы</h1>
        <p className={styles.subtitle}>Основные метрики и статистика платформы</p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Всего пользователей</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.totalUsers)}</h3>
            </div>
            <Users size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.totalUsers)}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Новые за неделю</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.newUsersWeek)}</h3>
            </div>
            <UserCheck size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.newUsersWeek)}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Новые за месяц</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.newUsersMonth)}</h3>
            </div>
            <UserCheck size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.newUsersMonth)}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Всего публикаций</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.totalPosts)}</h3>
            </div>
            <FileText size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.totalPosts)}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>На модерации</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.pendingModeration)}</h3>
            </div>
            <Clock size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.pendingModeration)}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Активные пользователи</p>
              <h3 className={styles.metricValue}>{formatNumber(mockMetrics.activeUsers)}</h3>
            </div>
            <Users size={24} className={styles.metricIcon} />
          </div>
          {renderChange(mockChanges.activeUsers)}
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Быстрые действия</h2>
        <div className={styles.actionsList}>
          <button className={styles.actionButton}>
            <Users className={styles.actionIcon} size={20} />
            Управление пользователями
          </button>
          <button className={styles.actionButton}>
            <Clock className={styles.actionIcon} size={20} />
            Очередь модерации
          </button>
          <button className={styles.actionButton}>
            <AlertCircle className={styles.actionIcon} size={20} />
            Системные уведомления
          </button>
          <button className={styles.actionButton}>
            <FileText className={styles.actionIcon} size={20} />
            Отчеты и логи
          </button>
        </div>
      </div>
    </div>
  )
}
