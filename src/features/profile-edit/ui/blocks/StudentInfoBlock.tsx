"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import type { StudentProfile, AuthorProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface StudentInfoData {
  placeWork: string
  location: string
  gpa?: number
  programType: "Бакалавриат" | "Магистратура" | "Ординатура" | "Аспирантура"
}


interface StudentInfoBlockProps {
  data: StudentInfoData
  onChange: (field: ProfileKeys, value: any) => void
}

const programTypeOptions = [
  { value: "Бакалавриат", label: "Бакалавриат" },
  { value: "Магистратура", label: "Магистратура" },
  { value: "Ординатура", label: "Ординатура" },
  { value: "Аспирантура", label: "Аспирантура" },
] as const

export const StudentInfoBlock: React.FC<StudentInfoBlockProps> = ({ data, onChange }) => {
  const validateGPA = (value: string): string => {
    if (!value) return ""

    const numValue = Number.parseFloat(value)
    if (Number.isNaN(numValue)) return "GPA должен быть числом"
    if (numValue < 0) return "GPA не может быть меньше 0"
    if (numValue > 5) return "GPA не может быть больше 5"

    return ""
  }

  const handleGPAChange = (value: string) => {
    if (value === "") {
      onChange("gpa", undefined)
      return
    }

    const numValue = Number.parseFloat(value)
    if (!Number.isNaN(numValue)) {
      const roundedValue = Math.round(numValue * 100) / 100
    }
  }

  const handleProgramTypeChange = (value: string) => {
    onChange("programType", value as StudentInfoData["programType"])
  }

  const gpaError = validateGPA(data.gpa?.toString() || "")

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Учебная информация</h3>

      <div className={styles.formGrid}>
        <Form.Group>
          <Form.Label className={styles.label}>Место работы/учёбы</Form.Label>
          <Form.Control
            type="text"
            value={data.placeWork}
            onChange={(e) => onChange("placeWork", e.target.value)}
            className={styles.input}
            placeholder="Введите место работы или учёбы"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Местоположение</Form.Label>
          <Form.Control
            type="text"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            className={styles.input}
            placeholder="Город, страна"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>GPA (0-5)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="5"
            step="0.01"
            value={data.gpa?.toString() || ""}
            onChange={(e) => handleGPAChange(e.target.value)}
            className={`${styles.input} ${gpaError ? styles.inputError : ""}`}
            placeholder="Например: 4.75"
          />
          {gpaError && <div className={styles.errorText}>{gpaError}</div>}
          {!gpaError && !data.gpa && (
            <div className={styles.helpText}>Оставьте пустым, если не хотите указывать GPA</div>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Тип программы</Form.Label>
          <Form.Select
            value={data.programType}
            onChange={(e) => handleProgramTypeChange(e.target.value)}
            className={styles.input}
          >
            {programTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </div>
  )
}
