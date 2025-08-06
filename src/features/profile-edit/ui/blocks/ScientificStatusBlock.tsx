"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Form, Alert } from "react-bootstrap"
import { Plus, X } from "lucide-react"
import type { ScientificStatus, AcademicDegree, AcademicTitle, AcademicRank } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface ScientificStatusBlockProps {
  scientificStatus: ScientificStatus
  onChange: (field: string, value: ScientificStatus) => void
  attemptedSave?: boolean
}

const degreeOptions: { value: AcademicDegree | ""; label: string }[] = [
  { value: "", label: "Нет" },
  { value: "Кандидат медицинских наук", label: "Кандидат медицинских наук" },
  { value: "Доктор медицинских наук", label: "Доктор медицинских наук" },
]

const titleOptions: { value: AcademicTitle | ""; label: string }[] = [
  { value: "", label: "Нет" },
  { value: "Доцент", label: "Доцент" },
  { value: "Профессор", label: "Профессор" },
]

const rankOptions: { value: AcademicRank | ""; label: string }[] = [
  { value: "", label: "Нет" },
  { value: "Член-корреспондент РАН", label: "Член-корреспондент РАН" },
  { value: "Академик РАН", label: "Академик РАН" },
]

export const ScientificStatusBlock: React.FC<ScientificStatusBlockProps> = ({
  scientificStatus,
  onChange,
  attemptedSave = false,
}) => {
  const [newInterest, setNewInterest] = useState("")

  const updateScientificStatus = (field: keyof ScientificStatus, value: any) => {
    const updated = { ...scientificStatus, [field]: value }
    onChange("scientificStatus", updated)
  }

  const addInterest = () => {
    if (newInterest.trim() && scientificStatus.interests.length < 10) {
      const updatedInterests = [...scientificStatus.interests, newInterest.trim()]
      updateScientificStatus("interests", updatedInterests)
      setNewInterest("")
    }
  }

  const removeInterest = (index: number) => {
    const updatedInterests = scientificStatus.interests.filter((_, i) => i !== index)
    updateScientificStatus("interests", updatedInterests)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addInterest()
    }
  }

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Научный статус</h3>

      <Alert variant="info" className={styles.moderationAlert}>
        <small>
          Информация о научном статусе должна пройти модерацию. До завершения проверки будут отображаться старые
          значения.
        </small>
      </Alert>

      <div className={styles.formGrid} style={{ paddingBottom: "1rem" }}>
        <Form.Group>
          <Form.Label className={styles.label}>Ученая степень</Form.Label>
          <Form.Select
            value={scientificStatus.degree || ""}
            onChange={(e) => updateScientificStatus("degree", e.target.value || null)}
            className={styles.input}
          >
            {degreeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Ученое звание</Form.Label>
          <Form.Select
            value={scientificStatus.title || ""}
            onChange={(e) => updateScientificStatus("title", e.target.value || null)}
            className={styles.input}
          >
            {titleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.label}>Академическое звание</Form.Label>
          <Form.Select
            value={scientificStatus.rank || ""}
            onChange={(e) => updateScientificStatus("rank", e.target.value || null)}
            className={styles.input}
          >
            {rankOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <Form.Group>
        <Form.Label className={styles.label}>Область научных интересов</Form.Label>
        <div className={styles.interestInputContainer}>
          <Form.Control
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
            placeholder="Например: молекулярная биология"
            disabled={scientificStatus.interests.length >= 10}
          />
          <button
            type="button"
            onClick={addInterest}
            disabled={!newInterest.trim() || scientificStatus.interests.length >= 10}
            className={styles.addInterestButton}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className={styles.helpText}>Добавьте теги с областями ваших научных интересов (максимум 10)</div>

        {scientificStatus.interests.length > 0 && (
          <div className={styles.interestTags}>
            {scientificStatus.interests.map((interest, index) => (
              <div key={index} className={styles.interestTag}>
                <span>{interest}</span>
                <button type="button" onClick={() => removeInterest(index)} className={styles.removeTagButton}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Form.Group>
    </div>
  )
}
