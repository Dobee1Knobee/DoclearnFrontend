"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, Briefcase } from "lucide-react"
import type { Work } from "@/entities/user/model/newTypes"
import styles from "./FormBlock.module.css"

interface WorkHistoryBlockProps {
  workHistory: Work[]
  onChange: (field: string, value: Work[]) => void
  onValidationChange?: (hasErrors: boolean) => void
}

interface FieldTouched {
  [key: string]: {
    organizationName?: boolean
    position?: boolean
    startDate?: boolean
    endDate?: boolean
  }
}

export const WorkHistoryBlock: React.FC<WorkHistoryBlockProps> = ({
  workHistory = [],
  onChange,
  onValidationChange,
}) => {
  const currentYear = new Date().getFullYear()
  const [touchedFields, setTouchedFields] = useState<FieldTouched>({})

  const addWork = () => {
    const newWork: Work = {
      id: `temp_${Date.now()}`,
      organizationName: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrently: false,
    }
    onChange("workHistory", [...workHistory, newWork])
  }

  const removeWork = (index: number) => {
    const newWorkHistory = workHistory.filter((_, i) => i !== index)
    onChange("workHistory", newWorkHistory)

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
    checkValidation(newWorkHistory, reindexedTouchedFields)
  }

  const updateWork = (index: number, field: keyof Work, value: string | boolean) => {
    const newWorkHistory = [...workHistory]
    newWorkHistory[index] = { ...newWorkHistory[index], [field]: value }
    onChange("workHistory", newWorkHistory)
    checkValidation(newWorkHistory, touchedFields)
  }

  const handleFieldBlur = (index: number, fieldName: keyof Work) => {
    const newTouchedFields = {
      ...touchedFields,
      [index]: {
        ...touchedFields[index],
        [fieldName]: true,
      },
    }
    setTouchedFields(newTouchedFields)
    checkValidation(workHistory, newTouchedFields)
  }

  const validateWorkItem = (work: Work, index: number, touched: FieldTouched) => {
    const errors: Record<string, string> = {}
    const fieldTouched = touched[index] || {}

    if (fieldTouched.organizationName && work.organizationName.trim() === "") {
      errors.organizationName = "Название организации обязательно"
    }

    if (fieldTouched.position && work.position.trim() === "") {
      errors.position = "Должность обязательна"
    }

    if (fieldTouched.startDate) {
      if (!work.startDate) {
        errors.startDate = "Дата начала работы обязательна"
      } else {
        const startDate = new Date(work.startDate)
        const currentDate = new Date()
        if (startDate > currentDate) {
          errors.startDate = "Дата начала не может быть в будущем"
        }
      }
    }

    if (fieldTouched.endDate && !work.isCurrently) {
      if (!work.endDate) {
        errors.endDate = "Дата окончания работы обязательна"
      } else {
        const startDate = new Date(work.startDate)
        const endDate = new Date(work.endDate)
        if (endDate < startDate) {
          errors.endDate = "Дата окончания не может быть раньше даты начала"
        }
        if (endDate > new Date()) {
          errors.endDate = "Дата окончания не может быть в будущем"
        }
      }
    }

    return errors
  }

  const checkValidation = (workList: Work[], touched: FieldTouched) => {
    let hasErrors = false

    workList.forEach((work, index) => {
      const errors = validateWorkItem(work, index, touched)
      if (Object.keys(errors).length > 0) {
        hasErrors = true
      }
    })

    workList.forEach((work) => {
      if (
        !work.organizationName.trim() ||
        !work.position.trim() ||
        !work.startDate ||
        (!work.isCurrently && !work.endDate)
      ) {
        hasErrors = true
      }
    })

    onValidationChange?.(hasErrors)
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Места работы</h3>
        <button className={styles.addButton} onClick={addWork}>
          <Plus size={16} />
          Добавить место работы
        </button>
      </div>

      {workHistory.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Места работы не добавлены. Нажмите &quot;Добавить место работы&quot;.
        </Alert>
      )}

      <div className={styles.educationList}>
        {workHistory.map((work, index) => {
          const fieldTouched = touchedFields[index] || {}
          const errors = validateWorkItem(work, index, touchedFields)

          return (
            <div key={work.id || index} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <Briefcase size={16} className={styles.educationIcon} />
                <span className={styles.educationNumber}>Место работы {index + 1}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeWork(index)}
                  className={styles.removeButton}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className={styles.educationFields}>
                <Form.Group>
                  <Form.Label className={styles.label}>Организация</Form.Label>
                  <Form.Control
                    type="text"
                    value={work.organizationName}
                    onChange={(e) => updateWork(index, "organizationName", e.target.value)}
                    onBlur={() => handleFieldBlur(index, "organizationName")}
                    className={`${styles.input} ${errors.organizationName ? styles.inputError : ""}`}
                    placeholder="Название организации"
                  />
                  {errors.organizationName && <div className={styles.errorText}>{errors.organizationName}</div>}
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.label}>Должность</Form.Label>
                  <Form.Control
                    type="text"
                    value={work.position}
                    onChange={(e) => updateWork(index, "position", e.target.value)}
                    onBlur={() => handleFieldBlur(index, "position")}
                    className={`${styles.input} ${errors.position ? styles.inputError : ""}`}
                    placeholder="Ваша должность"
                  />
                  {errors.position && <div className={styles.errorText}>{errors.position}</div>}
                </Form.Group>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Дата начала работы</Form.Label>
                    <Form.Control
                      type="date"
                      value={work.startDate}
                      onChange={(e) => updateWork(index, "startDate", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "startDate")}
                      className={`${styles.input} ${errors.startDate ? styles.inputError : ""}`}
                    />
                    {errors.startDate && <div className={styles.errorText}>{errors.startDate}</div>}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>Дата окончания работы</Form.Label>
                    <Form.Control
                      type="date"
                      value={work.endDate || ""}
                      onChange={(e) => updateWork(index, "endDate", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "endDate")}
                      className={`${styles.input} ${errors.endDate ? styles.inputError : ""}`}
                      disabled={work.isCurrently}
                    />
                    {errors.endDate && <div className={styles.errorText}>{errors.endDate}</div>}
                  </Form.Group>
                </div>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`currently-working-${index}`}
                    label="По настоящее время"
                    checked={work.isCurrently || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      const newWorkHistory = [...workHistory]
                      const updatedWorkItem = { ...newWorkHistory[index] }

                      updatedWorkItem.isCurrently = isChecked
                      if (isChecked) {
                        updatedWorkItem.endDate = ""
                        const newTouchedFields = {
                          ...touchedFields,
                          [index]: {
                            ...touchedFields[index],
                            endDate: false,
                          },
                        }
                        setTouchedFields(newTouchedFields)
                      }

                      newWorkHistory[index] = updatedWorkItem
                      onChange("workHistory", newWorkHistory)
                      checkValidation(newWorkHistory, touchedFields)
                    }}
                    className={styles.checkbox}
                  />
                </Form.Group>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
