"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import type { SpecialistUser } from "@/entities/user/model/newTypes"
import styles from "./FormBlock.module.css"

interface ProfileInfoBlockProps {
  user: SpecialistUser
  onChange: (field: keyof SpecialistUser, value: any) => void
}

export const ProfileInfoBlock: React.FC<ProfileInfoBlockProps> = ({ user, onChange }) => {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Основная информация</h3>

      <div className={styles.formRow}>
        <Form.Group>
          <Form.Label className={styles.label}>Местоположение</Form.Label>
          <Form.Control
            type="text"
            value={user.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className={styles.input}
            placeholder="Город, страна"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Основная специализация</Form.Label>
          <Form.Control
            type="text"
            value={user.mainSpecialization || ""}
            onChange={(e) => onChange("mainSpecialization", e.target.value)}
            className={styles.input}
            placeholder="Например: Кардиология"
          />
        </Form.Group>
      </div>

      <div className={styles.formRow}>
        <Form.Group>
          <Form.Label className={styles.label}>Место учёбы</Form.Label>
          <Form.Control
            type="text"
            value={user.placeStudy || ""}
            onChange={(e) => onChange("placeStudy", e.target.value)}
            className={styles.input}
            placeholder="Учебное заведение"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Текущее место работы</Form.Label>
          <Form.Control
            type="text"
            value={user.placeWork || ""}
            onChange={(e) => onChange("placeWork", e.target.value)}
            className={styles.input}
            placeholder="Место работы"
          />
        </Form.Group>
      </div>

      <Form.Group>
        <Form.Label className={styles.label}>Опыт работы</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={user.experience || ""}
          onChange={(e) => onChange("experience", e.target.value)}
          className={styles.input}
          placeholder="Опишите ваш опыт работы"
        />
      </Form.Group>
    </div>
  )
}
