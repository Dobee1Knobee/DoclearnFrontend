"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar } from "lucide-react"
import { setDateRange } from "@/features/article-filters/model/slice"
import { selectFiltersState } from "@/features/article-filters/model/selectors"
import type { AppDispatch } from "@/app/store"
import styles from "./DateFilter.module.css"

export function DateFilter() {
  const dispatch = useDispatch<AppDispatch>()
  const { dateRange } = useSelector(selectFiltersState)
  const [fromDate, setFromDate] = useState(dateRange.from || "")
  const [toDate, setToDate] = useState(dateRange.to || "")

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value)
    dispatch(setDateRange({ from: e.target.value, to: toDate }))
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value)
    dispatch(setDateRange({ from: fromDate, to: e.target.value }))
  }

  // ДОбавить красивый выбор даты 
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Дата публикации</h3>

      <div className={styles.dateSection}>
        <label className={styles.label}>От</label>
        <div className={styles.datePickerWrapper}>
          <Calendar size={16} className={styles.calendarIcon} />
          <input type="date" className={styles.datePicker} value={fromDate} onChange={handleFromDateChange} />
        </div>
      </div>

      <div className={styles.dateSection}>
        <label className={styles.label}>До</label>
        <div className={styles.datePickerWrapper}>
          <Calendar size={16} className={styles.calendarIcon} />
          <input type="date" className={styles.datePicker} value={toDate} onChange={handleToDateChange} />
        </div>
      </div>
    </div>
  )
}

