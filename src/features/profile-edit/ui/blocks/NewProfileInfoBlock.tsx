"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import styles from "./FormBlock.module.css"

interface ProfileInfoData {
  location: string
  experience: string
  placeWork: string
  placeStudy: string
}

interface NewProfileInfoBlockProps {
  data: ProfileInfoData
  onChange: (field: string, value: any) => void
}

export const NewProfileInfoBlock: React.FC<NewProfileInfoBlockProps> = ({ data, onChange }) => {

    // const moderationFields = ["placeWork", "placeStudy"]

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
                    {/* {moderationFields.includes("placeWork") && <span className={styles.moderationBadge}>Модерация</span>} */}
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
                    {/* {moderationFields.includes("placeStudy") && <span className={styles.moderationBadge}>Модерация</span>} */}
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

    </div>
  )
}
