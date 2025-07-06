"use client"

import type React from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import type { Education, AuthorProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface EducationBlockProps {
  education: Education[]
  onChange: (field: keyof AuthorProfile, value: any) => void
}

export const EducationBlock: React.FC<EducationBlockProps> = ({ education = [], onChange }) => {
  
  const addEducation = () => {
    const newEducation: Education = {
      id: `temp_${Date.now()}`,
      institution: "",
      degree: "",
      specialty: "",
      startDate: "",
      graduationYear: "",
      isCurrently: false,
    }
    onChange("education", [...education, newEducation])
  }

  const removeEducation = (index: number) => {
    const newEducation = education.filter((_, i) => i !== index)
    onChange("education", newEducation)
  }

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    onChange("education", newEducation)
  }

  const validateDates = (startDate: string, graduationYear: string, isCurrently: boolean) => {
    if (!startDate) return "Дата начала обязательна"

    const start = new Date(startDate).getFullYear()
    const currentYear = new Date().getFullYear()

    if (start > currentYear) {
      return "Дата начала не может быть в будущем"
    }

    if (!isCurrently && graduationYear) {
      const graduation = Number.parseInt(graduationYear)
      if (graduation < start) {
        return "Год окончания не может быть раньше года начала"
      }
      if (graduation > currentYear) {
        return "Год окончания не может быть в будущем"
      }
    }

    return ""
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Образование</h3>
        <button className={styles.addButton} onClick={addEducation}>
          <Plus size={16} />
          Добавить образование
        </button>
      </div>

      <Alert variant="info" className={styles.moderationAlert}>
        <small>
          Информация об образовании должна пройти модерацию. До завершения проверки будут отображаться старые значения.
        </small>
      </Alert>

      {education.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Образование не добавлено. Нажмите "Добавить образование".
        </Alert>
      )}

      <div className={styles.educationList}>
        {education.map((edu, index) => {
          const dateError = validateDates(edu.startDate, edu.graduationYear, edu.isCurrently)

          return (
            <div key={edu.id || index} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <GraduationCap size={16} className={styles.educationIcon} />
                <span className={styles.educationNumber}>Образование {index + 1}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className={styles.removeButton}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className={styles.educationFields}>
                <Form.Group>
                  <Form.Label className={styles.label}>Учебное заведение *</Form.Label>
                  <Form.Control
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    className={styles.input}
                    placeholder="Название университета, института, колледжа"
                  />
                </Form.Group>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Степень/Квалификация</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className={styles.input}
                      placeholder="Бакалавр, Магистр, Специалист"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>Специальность</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.specialty || ""}
                      onChange={(e) => updateEducation(index, "specialty", e.target.value)}
                      className={styles.input}
                      placeholder="Направление подготовки"
                    />
                  </Form.Group>
                </div>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Дата начала *</Form.Label>
                    <Form.Control
                      type="date"
                      value={edu.startDate ? edu.startDate.split("T")[0] : ""}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      className={`${styles.input} ${dateError ? styles.inputError : ""}`}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>
                      {edu.isCurrently ? "Год окончания (ожидаемый)" : "Год окончания"}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1950"
                      max="2030"
                      value={edu.graduationYear || ""}
                      onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                      className={`${styles.input} ${dateError ? styles.inputError : ""}`}
                      placeholder="2024"
                      disabled={edu.isCurrently}
                    />
                  </Form.Group>
                </div>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`currently-studying-${index}`}
                    label="Обучаюсь в настоящее время"
                    checked={edu.isCurrently || false}
                    onChange={(e) => {
                      updateEducation(index, "isCurrently", e.target.checked)
                      if (e.target.checked) {
                        updateEducation(index, "graduationYear", "")
                      }
                    }}
                    className={styles.checkbox}
                  />
                </Form.Group>

                {dateError && <div className={styles.errorText}>{dateError}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


