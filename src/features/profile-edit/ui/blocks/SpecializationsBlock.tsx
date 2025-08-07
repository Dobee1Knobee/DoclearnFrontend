"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, Stethoscope } from 'lucide-react'
import type { Specialization, SpecializationMethod, QualificationCategory } from "@/entities/user/model/types"
import { Combobox } from "@/shared/ui/Combobox/Combobox"
import type { ComboboxOptionsType } from "@/shared/ui/Combobox/types"
import { specializations as specializationsData } from "@/shared/data/specializations"
import styles from "./FormBlock.module.css"

interface SpecializationsBlockProps {
  specializations: Specialization[]
  onChange: (field: string, value: Specialization[]) => void
  onValidationChange?: (hasErrors: boolean) => void
  attemptedSave?: boolean
}

interface FieldTouched {
  [key: number]: {
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
  { value: null, label: "Нет" },
  { value: "Вторая категория", label: "Вторая категория" },
  { value: "Первая категория", label: "Первая категория" },
  { value: "Высшая категория", label: "Высшая категория" },
]

export const SpecializationsBlock: React.FC<SpecializationsBlockProps> = ({
  specializations: userSpecializations = [],
  onChange,
  onValidationChange,
  attemptedSave = false,
}) => {
  const [touchedFields, setTouchedFields] = useState<FieldTouched>({})

  const specializationOptions: ComboboxOptionsType[] = useMemo(() => {
    return specializationsData.map((spec) => ({
      id: spec.id,
      label: spec.label,
      value: spec,
    }))
  }, [])

  useEffect(() => {
    checkValidation(userSpecializations, touchedFields)
  }, [attemptedSave, userSpecializations, touchedFields])

  const addSpecialization = () => {
    const newSpecialization: Specialization = {
      specializationId: "",
      name: "",
      method: "Ординатура",
      qualificationCategory: null,
      main: false,
    }
    onChange("specializations", [...userSpecializations, newSpecialization])
  }

  const removeSpecialization = (index: number) => {
    const newSpecializations = userSpecializations.filter((_, i) => i !== index)
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

  const updateSpecialization = (index: number, field: keyof Specialization, value: any) => {
    const newSpecializations = [...userSpecializations]
    newSpecializations[index] = { ...newSpecializations[index], [field]: value }
    onChange("specializations", newSpecializations)
    checkValidation(newSpecializations, touchedFields)
  }

  const handleSpecializationSelect = (index: number, option: ComboboxOptionsType | null) => {
    const newSpecs = userSpecializations.map((spec, i) =>
      i === index
        ? option
          ? {
              ...spec,
              name: option.value.label,
              specializationId: option.value.id
            }
          : {
              ...spec,
              name: "",
              specializationId: ""
            }
        : spec
    )

    onChange("specializations", newSpecs)

    const newTouchedFields = {
      ...touchedFields,
      [index]: {
        ...touchedFields[index],
        name: true
      }
    }
    setTouchedFields(newTouchedFields)

    checkValidation(newSpecs, newTouchedFields)
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
    checkValidation(userSpecializations, newTouchedFields)
  }

  const validateSpecializationItem = (spec: Specialization, index: number, touched: FieldTouched) => {
    const errors: Record<string, string> = {}
    const fieldTouched = touched[index] || {}

    if (fieldTouched.name || attemptedSave) {
      if (!spec.name.trim() || !spec.specializationId.trim()) {
        errors.name = "Специализация обязательна"
        return errors
      }

      const isValidSpecialization = specializationsData.some(s => s.id === spec.specializationId && s.label === spec.name)
      if (!isValidSpecialization) {
        errors.name = "Выберите специализацию из списка"
      }
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

    if (attemptedSave) {
      specList.forEach((spec) => {
        if (!spec.name.trim() || !spec.specializationId) {
          hasErrors = true
        }
        if (spec.name.trim() && spec.specializationId) {
          const isValidSpecialization = specializationsData.some(s => s.id === spec.specializationId && s.label === spec.name)
          if (!isValidSpecialization) {
            hasErrors = true
          }
        }
      })
    }

    onValidationChange?.(hasErrors)
  }

  const getSelectedOption = (spec: Specialization): ComboboxOptionsType | null => {
    if (!spec.specializationId) return null
    return specializationOptions.find(o => o.id === spec.specializationId) ?? null
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
        <small>
          Информация о специализациях должна пройти модерацию. До завершения проверки будут отображаться старые
          значения.
        </small>
      </Alert>

      {userSpecializations.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Специализации не добавлены. Нажмите &quot;Добавить специализацию&quot;.
        </Alert>
      )}

      <div className={styles.educationList}>
        {userSpecializations.map((spec, index) => {
          const fieldTouched = touchedFields[index] || {}
          const errors = validateSpecializationItem(spec, index, touchedFields)

          return (
            <div key={spec.specializationId || `temp_${index}`} className={styles.educationItem}>
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
                  <Combobox
                    options={specializationOptions}
                    value={getSelectedOption(spec)}
                    onChange={(option) => handleSpecializationSelect(index, option)}
                    placeholder="Выберите специализацию"
                    error={!!errors.name}
                    searchable={true}
                    onBlur={() => handleFieldBlur(index, "name")}
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
                      value={spec.qualificationCategory ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : (e.target.value as QualificationCategory);
                        updateSpecialization(index, "qualificationCategory", value);
                      }}
                      className={styles.input}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value || "null"} value={option.value ?? ""}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    id={`main-${index}`}
                    label="Практикую"
                    checked={spec.main}
                    onChange={(e) => updateSpecialization(index, "main", e.target.checked)}
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
