"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import type { SpecialistRole } from "@/entities/user/model/newTypes"
import styles from "./FormBlock.module.css"

interface ProfessionalStatusBlockProps {
  currentRole: SpecialistRole
  onChange: (role: SpecialistRole) => void
}

const roleOptions: { value: SpecialistRole; label: string }[] = [
  { value: "student", label: "Студент" },
  { value: "resident", label: "Ординатор" },
  { value: "postgraduate", label: "Аспирант" },
  { value: "doctor", label: "Врач" },
  { value: "researcher", label: "Научный сотрудник" },
]

export const ProfessionalStatusBlock: React.FC<ProfessionalStatusBlockProps> = ({ currentRole, onChange }) => {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Профессиональный статус</h3>

      <Form.Group>
        <Form.Label className={styles.label}>Текущий профессиональный статус</Form.Label>
        <Form.Select
          value={currentRole}
          onChange={(e) => onChange(e.target.value as SpecialistRole)}
          className={styles.input}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <div className={styles.helpText}>От выбора статуса зависят доступные разделы профиля</div>
      </Form.Group>
    </div>
  )
}
