"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface PersonalInfoData {
  firstName: string
  lastName: string
  birthday: string
}


interface PersonalInfoBlockProps {
  data: PersonalInfoData
  onChange: (field: ProfileKeys, value: any) => void
}

export const PersonalInfoBlock: React.FC<PersonalInfoBlockProps> = ({ data, onChange }) => {
  const calculateAge = (birthday: string) => {
    if (!birthday) return ""
    const birthDate = new Date(birthday)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const moderationFields = ["firstName", "lastName"]

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Личная информация</h3>
      <div className={styles.formGrid}>
        <Form.Group>
          <Form.Label className={styles.label}>
            Имя
            {moderationFields.includes("firstName") && <span className={styles.moderationBadge}>Модерация</span>}
          </Form.Label>
          <Form.Control
            type="text"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className={styles.input}
            placeholder="Введите имя"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>
            Фамилия
            {moderationFields.includes("lastName") && <span className={styles.moderationBadge}>Модерация</span>}
          </Form.Label>
          <Form.Control
            type="text"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className={styles.input}
            placeholder="Введите фамилию"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Дата рождения</Form.Label>
          <Form.Control
            type="date"
            value={data.birthday ? data.birthday.split("T")[0] : ""}
            onChange={(e) => onChange("birthday", e.target.value)}
            className={styles.input}
          />
        </Form.Group>
      </div>
    </div>
  )
}
