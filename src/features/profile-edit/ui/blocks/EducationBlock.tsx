"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import type { Education, AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

type ProfileKeys = keyof AuthorProfile | keyof StudentProfile

interface EducationBlockProps {
  education: Education[]
  onChange: (field: ProfileKeys, value: any) => void
  onValidationChange?: (hasErrors: boolean) => void
}

interface FieldTouched {
  [key: string]: {
    institution?: boolean
    degree?: boolean
    specialty?: boolean
    startDate?: boolean
    graduationYear?: boolean
  }
}

export const EducationBlock: React.FC<EducationBlockProps> = ({ education = [], onChange, onValidationChange }) => {
  const currentYear = new Date().getFullYear()
  const [touchedFields, setTouchedFields] = useState<FieldTouched>({})

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
    checkValidation(newEducation, reindexedTouchedFields)
  }

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    onChange("education", newEducation)
    checkValidation(newEducation, touchedFields)
  }

  const handleFieldBlur = (index: number, fieldName: keyof Education) => {
    const newTouchedFields = {
      ...touchedFields,
      [index]: {
        ...touchedFields[index],
        [fieldName]: true,
      },
    }
    setTouchedFields(newTouchedFields)
    checkValidation(education, newTouchedFields)
  }

  const validateEducationItem = (edu: Education, index: number, touched: FieldTouched) => {
    const errors: Record<string, string> = {}
    const fieldTouched = touched[index] || {}

    if (fieldTouched.institution && edu.institution.trim() === "") {
      errors.institution = "Учебное заведение обязательно"
    }

    if (fieldTouched.degree && edu.degree.trim() === "") {
      errors.degree = "Степень/Квалификация обязательна"
    }

    if (fieldTouched.specialty && edu.specialty.trim() === "") {
      errors.specialty = "Специальность обязательна"
    }

    if (fieldTouched.startDate) {
      if (!edu.startDate) {
        errors.startDate = "Год начала обязателен"
      } else {
        const startYear = Number.parseInt(edu.startDate)
        if (Number.isNaN(startYear)) {
          errors.startDate = "Год начала должен быть числом"
        } else if (startYear > currentYear) {
          errors.startDate = "Год начала не может быть в будущем"
        } else if (startYear < 1900) {
          errors.startDate = "Год начала слишком ранний"
        }
      }
    }

    if (fieldTouched.graduationYear && !edu.isCurrently) {
      if (!edu.graduationYear) {
        errors.graduationYear = "Год окончания обязателен"
      } else {
        const startYear = Number.parseInt(edu.startDate)
        const graduation = Number.parseInt(edu.graduationYear)
        if (Number.isNaN(graduation)) {
          errors.graduationYear = "Год окончания должен быть числом"
        } else if (graduation < startYear) {
          errors.graduationYear = "Год окончания не может быть раньше года начала"
        } else if (graduation > currentYear) {
          errors.graduationYear = "Год окончания не может быть в будущем"
        }
      }
    }

    return errors
  }

  const checkValidation = (educationList: Education[], touched: FieldTouched) => {
    let hasErrors = false

    educationList.forEach((edu, index) => {
      const errors = validateEducationItem(edu, index, touched)
      if (Object.keys(errors).length > 0) {
        hasErrors = true
      }
    })

    educationList.forEach((edu) => {
      if (
        !edu.institution.trim() ||
        !edu.degree.trim() ||
        !edu.specialty.trim() ||
        !edu.startDate ||
        (!edu.isCurrently && !edu.graduationYear)
      ) {
        hasErrors = true
      }
    })

    onValidationChange?.(hasErrors)
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
          const fieldTouched = touchedFields[index] || {}
          const errors = validateEducationItem(edu, index, touchedFields)

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
                  <Form.Label className={styles.label}>Учебное заведение</Form.Label>
                  <Form.Control
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    onBlur={() => handleFieldBlur(index, "institution")}
                    className={`${styles.input} ${errors.institution ? styles.inputError : ""}`}
                    placeholder="Название университета, института, колледжа"
                  />
                  {errors.institution && <div className={styles.errorText}>{errors.institution}</div>}
                </Form.Group>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Степень/Квалификация</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "degree")}
                      className={`${styles.input} ${errors.degree ? styles.inputError : ""}`}
                      placeholder="Бакалавр, Магистр, Специалист"
                    />
                    {errors.degree && <div className={styles.errorText}>{errors.degree}</div>}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>Специальность</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.specialty || ""}
                      onChange={(e) => updateEducation(index, "specialty", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "specialty")}
                      className={`${styles.input} ${errors.specialty ? styles.inputError : ""}`}
                      placeholder="Направление подготовки"
                    />
                    {errors.specialty && <div className={styles.errorText}>{errors.specialty}</div>}
                  </Form.Group>
                </div>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Год начала</Form.Label>
                    <Form.Control
                      type="number"
                      min="1950"
                      max={currentYear}
                      value={edu.startDate || ""}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "startDate")}
                      className={`${styles.input} ${errors.startDate ? styles.inputError : ""}`}
                      placeholder="2020"
                    />
                    {errors.startDate && <div className={styles.errorText}>{errors.startDate}</div>}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>
                      Год окончания
                      {/* {edu.isCurrently ? "Год окончания (ожидаемый)" : "Год окончания"} */}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1950"
                      max={currentYear}
                      value={edu.graduationYear || ""}
                      onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                      onBlur={() => handleFieldBlur(index, "graduationYear")}
                      className={`${styles.input} ${errors.graduationYear ? styles.inputError : ""}`}
                      placeholder="2024"
                      disabled={edu.isCurrently}
                    />
                    {errors.graduationYear && <div className={styles.errorText}>{errors.graduationYear}</div>}
                  </Form.Group>
                </div>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`currently-studying-${index}`}
                    label="Обучаюсь в настоящее время"
                    checked={edu.isCurrently || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      const newEducation = [...education]
                      const updatedEduItem = { ...newEducation[index] }

                      updatedEduItem.isCurrently = isChecked
                      if (isChecked) {
                        updatedEduItem.graduationYear = ""
                        const newTouchedFields = {
                          ...touchedFields,
                          [index]: {
                            ...touchedFields[index],
                            graduationYear: false,
                          },
                        }
                        setTouchedFields(newTouchedFields)
                      }

                      newEducation[index] = updatedEduItem
                      onChange("education", newEducation)
                      checkValidation(newEducation, touchedFields)
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
