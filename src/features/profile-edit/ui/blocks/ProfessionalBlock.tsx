"use client"

import type React from "react"
import { useState } from "react"
import { Form, Alert } from "react-bootstrap"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface ProfessionalData {
  placeWork: string
  location: string
  experience: string
  specialization: string
}

type ProfileKeys = keyof AuthorProfile | keyof StudentProfile

interface ProfessionalBlockProps {
  data: ProfessionalData
  onChange: (field: ProfileKeys, value: any) => void
}

export const ProfessionalBlock: React.FC<ProfessionalBlockProps> = ({ data, onChange }) => {
  const [specializationFields, setSpecializationFields] = useState(() => {
    if (data.specialization) {
      const parts = data.specialization.split(", ")
      return {
        field1: parts[0] || "",
        field2: parts[1] || "",
        field3: parts[2] || "",
      }
    }
    return { field1: "", field2: "", field3: "" }
  })

  const handleSpecializationChange = (field: string, value: string) => {
    const newFields = { ...specializationFields, [field]: value }
    setSpecializationFields(newFields)

    const combinedSpecialization = [newFields.field1, newFields.field2, newFields.field3].filter(Boolean).join(", ")

    onChange("specialization", combinedSpecialization)
  }

  const handleExperienceChange = (value: string) => {
    onChange("experience", value)
  }

  const moderationFields = ["placeWork", "specialization"]

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Профессиональная информация</h3>

      <Alert variant="info" className={styles.moderationAlert}>
        <small>
          Поля &quot;Место работы&quot; и &quot;Специализация&quot; должны пройти модерацию. До завершения проверки будут отображаться
          старые значения.
        </small>
      </Alert>

      <div className={styles.formGrid}>
        <Form.Group>
          <Form.Label className={styles.label}>
            Место работы/учёбы
            {moderationFields.includes("placeWork") && <span className={styles.moderationBadge}>Модерация</span>}
          </Form.Label>
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
          <Form.Label className={styles.label}>Опыт работы</Form.Label>
          <Form.Control
            type="text"
            value={data.experience}
            onChange={(e) => handleExperienceChange(e.target.value)}
            className={styles.input}
            placeholder="Например: 5 лет в кардиологии"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>
            Специализация
            {moderationFields.includes("specialization") && <span className={styles.moderationBadge}>Модерация</span>}
          </Form.Label>
          <div className={styles.specializationGrid}>
            <Form.Control
              type="text"
              value={specializationFields.field1}
              onChange={(e) => handleSpecializationChange("field1", e.target.value)}
              className={styles.input}
              placeholder="Основная специализация"
            />
            <Form.Control
              type="text"
              value={specializationFields.field2}
              onChange={(e) => handleSpecializationChange("field2", e.target.value)}
              className={styles.input}
              placeholder="Дополнительная специализация"
            />
            <Form.Control
              type="text"
              value={specializationFields.field3}
              onChange={(e) => handleSpecializationChange("field3", e.target.value)}
              className={styles.input}
              placeholder="Категория"
            />
          </div>
        </Form.Group>
      </div>
    </div>
  )
}
