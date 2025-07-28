"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import styles from "./FormBlock.module.css"

interface ProfileInfoData {
  location: string
  experience: string
  placeWork: string
  placeStudy: string
  mainSpecialization: string
}

interface NewProfileInfoBlockProps {
  data: ProfileInfoData
  onChange: (field: string, value: any) => void
}

export const NewProfileInfoBlock: React.FC<NewProfileInfoBlockProps> = ({ data, onChange }) => {

    const moderationFields = ["placeWork", "placeStudy", "mainSpecialization"]

    return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Информация для отображения в профиле</h3>

        <div className={styles.formGrid} style={{"paddingBottom": "1rem"}}>
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
                    onChange={(e) => onChange("experience", e.target.value)}
                    className={styles.input}
                    placeholder="Количество лет опыта"
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className={styles.label}>
                    Место работы
                    {moderationFields.includes("placeWork") && <span className={styles.moderationBadge}>Модерация</span>}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={data.placeWork}
                    onChange={(e) => onChange("placeWork", e.target.value)}
                    className={styles.input}
                    placeholder="Название организации"
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className={styles.label}>
                    Место учебы
                    {moderationFields.includes("placeStudy") && <span className={styles.moderationBadge}>Модерация</span>}
                    </Form.Label>
                <Form.Control
                    type="text"
                    value={data.placeStudy}
                    onChange={(e) => onChange("placeStudy", e.target.value)}
                    className={styles.input}
                    placeholder="Название учебного заведения"
                />
            </Form.Group>
        </div>

        <Form.Group>
            <Form.Label className={styles.label}>
                Основная специализация
                {moderationFields.includes("mainSpecialization") && <span className={styles.moderationBadge}>Модерация</span>}
            </Form.Label>
            <Form.Control
                type="text"
                value={data.mainSpecialization}
                onChange={(e) => onChange("mainSpecialization", e.target.value)}
                className={styles.input}
                placeholder="Ваша основная специализация"
            />
        </Form.Group>
    </div>
  )
}
