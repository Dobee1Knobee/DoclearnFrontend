"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, Stethoscope } from "lucide-react"
import type { Specialization, SpecializationMethod, QualificationCategory } from "@/entities/user/model/newTypes"
import styles from "./FormBlock.module.css"

interface SpecializationsBlockProps {
  specializations: Specialization[]
  onChange: (field: string, value: Specialization[]) => void
  onValidationChange?: (hasErrors: boolean) => void
}

interface FieldTouched {
  [key: string]: {
    name?: boolean
    method?: boolean
    qualificationCategory?: boolean
  }
}

const methodOptions: { value: SpecializationMethod; label: string }[] = [
  { value: "Ординатура", label: "Ординатура" },
  { value: "Профессиональная переподготовка", label: "Профессиональная переподготовка" },
]

const categoryOptions: { value: QualificationCategory; label: string }[] = [
  { value: "Вторая категория", label: "Вторая категория" },
  { value: "Первая категория", label: "Первая категория" },
  { value: "Высшая категория", label: "Высшая категория" },
]

export const SpecializationsBlock: React.FC<SpecializationsBlockProps> = ({
  specializations = [],
  onChange,
  onValidationChange,
}) => {
  const [touchedFields, setTouchedFields] = useState<FieldTouched>({})

  const addSpecialization = () => {
    const newSpecialization: Specialization = {
      id: `temp_${Date.now()}`,
      name: "",
      method: "Ординатура",
      qualificationCategory: "Вторая категория",
    }
    onChange("specializations", [...specializations, newSpecialization])
  }

  const removeSpecialization = (index: number) => {
    const newSpecializations = specializations.filter((_, i) => i !== index)
    onChange("specializations", newSpecializations)

    const newTouchedFields = { ...touchedFields }
    delete newTouchedFields[index]

    const reindexedTouchedFields: FieldTouched = {}
    Object.keys(newTouchedFields).forEach((key) => {
      const oldIndex = Number.parseInt(key)
      if (oldIndex > index) {
        reindexedTouchedFields[oldIndex - 1] = newTouchedFields[oldIndex]
      } else if (oldIndex < index) {
        reindexedTouchedFields[oldIndex] = newTouchedFields[oldIndex]
      }
    })

    setTouchedFields(reindexedTouchedFields)
    checkValidation(newSpecializations, reindexedTouchedFields)
  }

  const updateSpecialization = (index: number, field: keyof Specialization, value: string) => {
    const newSpecializations = [...specializations]
    newSpecializations[index] = { ...newSpecializations[index], [field]: value }
    onChange("specializations", newSpecializations)
    checkValidation(newSpecializations, touchedFields)
  }

  const handleFieldBlur = (index: number, fieldName: keyof Specialization) => {
    const newTouchedFields = {
      ...touchedFields,
      [index]: {
        ...touchedFields[index],
        [fieldName]: true,
      },
    }
    setTouchedFields(newTouchedFields)
    checkValidation(specializations, newTouchedFields)
  }

  const validateSpecializationItem = (spec: Specialization, index: number, touched: FieldTouched) => {
    const errors: Record<string, string> = {}
    const fieldTouched = touched[index] || {}

    if (fieldTouched.name && spec.name.trim() === "") {
      errors.name = "Название специальности обязательно"
    }

    return errors
  }

  const checkValidation = (specList: Specialization[], touched: FieldTouched) => {
    let hasErrors = false

    specList.forEach((spec, index) => {
      const errors = validateSpecializationItem(spec, index, touched)
      if (Object.keys(errors).length > 0) {
        hasErrors = true
      }
    })

    specList.forEach((spec) => {
      if (!spec.name.trim()) {
        hasErrors = true
      }
    })

    onValidationChange?.(hasErrors)
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Специализации</h3>
        <button className={styles.addButton} onClick={addSpecialization}>
          <Plus size={16} />
          Добавить специализацию
        </button>
      </div>

      <Alert variant="info" className={styles.moderationAlert}>
        <small>Информация о специализациях должна пройти модерацию. До завершения проверки будут отображаться старые значения.</small>
      </Alert>

      {specializations.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Специализации не добавлены. Нажмите &quot;Добавить специализацию&quot;.
        </Alert>
      )}

      <div className={styles.educationList}>
        {specializations.map((spec, index) => {
          const fieldTouched = touchedFields[index] || {}
          const errors = validateSpecializationItem(spec, index, touchedFields)

          return (
            <div key={spec.id || index} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <Stethoscope size={16} className={styles.educationIcon} />
                <span className={styles.educationNumber}>Специализация {index + 1}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeSpecialization(index)}
                  className={styles.removeButton}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className={styles.educationFields}>
                <Form.Group>
                  <Form.Label className={styles.label}>Специальность</Form.Label>
                  <Form.Control
                    type="text"
                    value={spec.name}
                    onChange={(e) => updateSpecialization(index, "name", e.target.value)}
                    onBlur={() => handleFieldBlur(index, "name")}
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    placeholder="Название специальности"
                  />
                  {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                </Form.Group>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Способ получения</Form.Label>
                    <Form.Select
                      value={spec.method}
                      onChange={(e) => updateSpecialization(index, "method", e.target.value)}
                      className={styles.input}
                    >
                      {methodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>Квалификационная категория</Form.Label>
                    <Form.Select
                      value={spec.qualificationCategory}
                      onChange={(e) => updateSpecialization(index, "qualificationCategory", e.target.value)}
                      className={styles.input}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
