"use client"

import type React from "react"
import { Form } from "react-bootstrap"
import type { AuthorProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface AboutBlockProps {
  bio: string
  onChange: (field: keyof AuthorProfile, value: any) => void
}

export const AboutBlock: React.FC<AboutBlockProps> = ({ bio, onChange }) => {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>О себе</h3>

      <Form.Group>
        <Form.Label className={styles.label}>Расскажите о себе</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          className={styles.textarea}
          placeholder="Расскажите о своем опыте, интересах, достижениях..."
        />
        <div className={styles.charCount}>{bio?.length || 0} символов</div>
      </Form.Group>
    </div>
  )
}
