"use client"

import React, { useState, useMemo } from "react"
import { Combobox as HeadlessCombobox, ComboboxButton, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react"
import { ChevronDown, X } from 'lucide-react'
import type { ComboboxProps, ComboboxOptionsType } from "./types"
import styles from "./Combobox.module.css"

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Выберите опцию",
  error = false,
  searchable = true,
  onBlur,
  disabled = false,
}) => {
  const [query, setQuery] = useState("")

  const filteredOptions = useMemo(() => {
    if (!searchable || query === "") {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query, searchable])

  const handleChange = (option: ComboboxOptionsType | null) => {
    onChange(option)
    setQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setQuery("")
  }

  return (
    <div className={styles.combobox}>
      <HeadlessCombobox value={value} onChange={handleChange} disabled={disabled}>
        <div className={styles.inputWrapper}>
          <ComboboxInput
            className={`${styles.input} ${error ? styles.error : ""}`}
            displayValue={(option: ComboboxOptionsType | null) => option?.label || ""}
            onChange={(event) => searchable && setQuery(event.target.value)}
            placeholder={placeholder}
            onBlur={onBlur}
            autoComplete="off"
          />
          
          {value && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              tabIndex={-1}
            >
              <X size={14} />
            </button>
          )}
          
          <ComboboxButton className={styles.chevronButton}>
            {({ open }) => (
              <ChevronDown
                size={16}
                className={`${styles.chevronIcon} ${open ? styles.open : ""}`}
              />
            )}
          </ComboboxButton>
        </div>

        <ComboboxOptions className={styles.options}>
          {filteredOptions.length === 0 && query !== "" ? (
            <div className={styles.noResults}>
              Ничего не найдено
            </div>
          ) : (
            filteredOptions.map((option) => (
              <ComboboxOption
                key={option.id}
                value={option}
                className={({ active, selected }) =>
                  `${styles.option} ${active ? styles.active : ""} ${
                    selected ? styles.selected : ""
                  }`
                }
              >
                {option.label}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </HeadlessCombobox>
    </div>
  )
}
