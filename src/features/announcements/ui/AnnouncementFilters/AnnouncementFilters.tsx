"use client"

import type React from "react"
import { useState } from "react"
import styles from "./AnnouncementFilters.module.css"

export const AnnouncementFilters: React.FC = () => {
  const [filters, setFilters] = useState({
    city: "",
    announcements: [] as string[],
    format: "",
    dateRange: "",
  })

  const handleSelectChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      announcements: checked ? [...prev.announcements, value] : prev.announcements.filter((item) => item !== value),
    }))
  }

  const handleRadioChange = (value: string) => {
    setFilters((prev) => ({ ...prev, format: value }))
  }

  const handleApply = () => {
  }

  const handleReset = () => {
    setFilters({
      city: "",
      announcements: [],
      format: "",
      dateRange: "",
    })
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Город</h4>
        <select
          className={styles.select}
          value={filters.city}
          onChange={(e) => handleSelectChange("city", e.target.value)}
        >
          <option value="">Выберите город</option>
          <option value="moscow">Москва</option>
          <option value="spb">Санкт-Петербург</option>
          <option value="ekb">Екатеринбург</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Тип объявления</h4>
        <div className={styles.checkboxGroup}>
          {["Вебинары", "Конференции", "Курсы", "Мастер-классы", "Вакансии", "Стажировки"].map((type) => (
            <label key={type} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.announcements.includes(type)}
                onChange={(e) => handleCheckboxChange(type, e.target.checked)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Формат проведения</h4>
        <div className={styles.radioGroup}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              value="online"
              checked={filters.format === "online"}
              onChange={(e) => handleRadioChange(e.target.value)}
            />
            <span>Онлайн</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              value="offline"
              checked={filters.format === "offline"}
              onChange={(e) => handleRadioChange(e.target.value)}
            />
            <span>Очно</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              value="hybrid"
              checked={filters.format === "hybrid"}
              onChange={(e) => handleRadioChange(e.target.value)}
            />
            <span>Гибрид</span>
          </label>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Дата проведения</h4>
        <select
          className={styles.select}
          value={filters.dateRange}
          onChange={(e) => handleSelectChange("dateRange", e.target.value)}
        >
          <option value="">Выберите период</option>
          <option value="today">Сегодня</option>
          <option value="week">На этой неделе</option>
          <option value="month">В этом месяце</option>
          <option value="quarter">В этом квартале</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyButton} onClick={handleApply}>
          Применить
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </div>
  )
}

          
