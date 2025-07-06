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

  const currentYear = new Date().getFullYear()

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
          const institutionError = edu.institution.trim() === "" ? "Учебное заведение обязательно" : ""
          const degreeError = edu.degree.trim() === "" ? "Степень/Квалификация обязательна" : ""
          const specialtyError = edu.specialty.trim() === "" ? "Специальность обязательна" : ""
          let startDateError = ""
          if (!edu.startDate) {
            startDateError = "Дата начала обязательна"
          } else {
            const start = new Date(edu.startDate).getFullYear()
            if (start > currentYear) {
              startDateError = "Дата начала не может быть в будущем"
            }
          }

          let graduationYearError = ""
          if (!edu.isCurrently) {
            if (!edu.graduationYear) {
              graduationYearError = "Год окончания обязателен"
            } else {
              const start = new Date(edu.startDate).getFullYear()
              const graduation = Number.parseInt(edu.graduationYear)
              if (graduation < start) {
                graduationYearError = "Год окончания не может быть раньше года начала"
              }
              if (graduation > currentYear) {
                graduationYearError = "Год окончания не может быть в будущем"
              }
            }
          }

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
                  <Form.Label className={styles.label}>Учебное заведение </Form.Label>
                  <Form.Control
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    className={`${styles.input} ${institutionError ? styles.inputError : ""}`}
                    placeholder="Название университета, института, колледжа"
                    required
                  />
                  {institutionError && <div className={styles.errorText}>{institutionError}</div>}                  
                </Form.Group>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Степень/Квалификация</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className={`${styles.input} ${degreeError ? styles.inputError : ""}`}
                      placeholder="Бакалавр, Магистр, Специалист"
                      required
                    />
                    {degreeError && <div className={styles.errorText}>{degreeError}</div>}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>Специальность</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.specialty || ""}
                      onChange={(e) => updateEducation(index, "specialty", e.target.value)}
                      className={`${styles.input} ${specialtyError ? styles.inputError : ""}`}
                      placeholder="Направление подготовки"
                      required
                    />
                    {specialtyError && <div className={styles.errorText}>{specialtyError}</div>}
                  </Form.Group>
                </div>

                <div className={styles.formRow}>
                  <Form.Group>
                    <Form.Label className={styles.label}>Дата начала</Form.Label>
                    <Form.Control
                      type="date"
                      value={edu.startDate ? edu.startDate.split("T")[0] : ""}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      className={`${styles.input} ${startDateError ? styles.inputError : ""}`}
                      required
                    />
                    {startDateError && <div className={styles.errorText}>{startDateError}</div>}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className={styles.label}>
                      {edu.isCurrently ? "Год окончания (ожидаемый)" : "Год окончания"}
                      {!edu.isCurrently && " *"}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1950"
                      max={currentYear}
                      value={edu.graduationYear || ""}
                      onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                      className={`${styles.input} ${graduationYearError ? styles.inputError : ""}`}
                      placeholder="2024"
                      disabled={edu.isCurrently}
                      required={!edu.isCurrently}
                    />
                    {graduationYearError && <div className={styles.errorText}>{graduationYearError}</div>}
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
                      }
                      
                      newEducation[index] = updatedEduItem
                      onChange("education", newEducation)
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


