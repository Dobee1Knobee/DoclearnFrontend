"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search } from "lucide-react"
import { toggleJournal } from "@/features/article-filters/model/slice"
import { selectFiltersState } from "@/features/article-filters/model/selectors"
import { popularJournals } from "@/features/article-filters/model/constants"
import type { AppDispatch } from "@/app/store"
import styles from "./JournalFilter.module.css"

export function JournalFilter() {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedJournals } = useSelector(selectFiltersState)
  const [journalSearch, setJournalSearch] = useState("")

  // сделать норм поиск
  const filteredJournals = popularJournals.filter((journal) =>
    journal.name.toLowerCase().includes(journalSearch.toLowerCase()),
  )

  const handleJournalToggle = (journalId: string) => {
    dispatch(toggleJournal(journalId))
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Издатель</h3>

      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск издателя.."
          value={journalSearch}
          onChange={(e) => setJournalSearch(e.target.value)}
        />
      </div>

      <div className={styles.journalsList}>
        {filteredJournals.map((journal) => (
          <div key={journal.id} className={styles.journalItem}>
            <label className={styles.journalLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedJournals.includes(journal.id)}
                onChange={() => handleJournalToggle(journal.id)}
              />
              <span className={styles.journalName}>{journal.name}</span>
            </label>
          </div>
        ))}

        {/* сделать обрезание journalSearch, чтобы не ломался от большого запроса */}

        {filteredJournals.length === 0 && (
          <p className={styles.noResults}>Не найдено журналов, соответствующих "{journalSearch}"</p>
        )}
      </div>
    </div>
  )
}

