"use client"

import { useState } from "react"
import { Plus, X, MoveUp, MoveDown, Calendar, Users } from "lucide-react"
import type { ConferenceStage } from "@/entities/announcement/model/index"
import { FormField } from "@/shared/ui/FormField/FormField"
import styles from "./StagesSection.module.css"

interface StagesSectionProps {
  stages: ConferenceStage[]
  onUpdate: (stages: ConferenceStage[]) => void
}

export function StagesSection({ stages, onUpdate }: StagesSectionProps) {
  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    date: "",
    maxParticipants: "",
  })
  const [errors, setErrors] = useState<{ name?: string }>({})

  const validateStage = () => {
    const newErrors: { name?: string } = {}

    if (!newStage.name.trim()) newErrors.name = "Название этапа обязательно"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addStage = () => {
    if (validateStage()) {
      const order = stages.length > 0 ? Math.max(...stages.map((s) => s.order)) + 1 : 1

      onUpdate([
        ...stages,
        {
          id: `temp-${Date.now()}`,
          name: newStage.name.trim(),
          description: newStage.description.trim() || "",
          date: newStage.date || "",
          maxParticipants: newStage.maxParticipants ? Number(newStage.maxParticipants) : undefined,
          order,
        },
      ])
      setNewStage({ name: "", description: "", date: "", maxParticipants: "" })
      setErrors({})
    }
  }

  const removeStage = (index: number) => {
    const updatedStages = stages.filter((_, i) => i !== index)
    const reorderedStages = updatedStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }))
    onUpdate(reorderedStages)
  }

  const moveStageUp = (index: number) => {
    if (index === 0) return
    const newStages = [...stages]
    ;[newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]]
    const reorderedStages = newStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }))
    onUpdate(reorderedStages)
  }

  const moveStageDown = (index: number) => {
    if (index === stages.length - 1) return
    const newStages = [...stages]
    ;[newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]]
    const reorderedStages = newStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }))
    onUpdate(reorderedStages)
  }

  return (
    <div className={styles.stagesSection}>
      <label className={styles.label}>Этапы конференции</label>
      <p className={styles.description}>
        Добавьте этапы (например: отборочный тур, полуфинал, финал)
      </p>

      {stages.length > 0 && (
        <div className={styles.stagesList}>
          {stages.map((stage, index) => (
            <div key={stage.id} className={styles.stageItem}>
              <div className={styles.stageHeader}>
                <span className={styles.stageOrder}>#{stage.order}</span>
                <div className={styles.stageInfo}>
                  <span className={styles.stageName}>{stage.name}</span>
                  {stage.description && <span className={styles.stageDescription}>{stage.description}</span>}
                  <div className={styles.stageDetails}>
                    {stage.date && (
                      <span className={styles.stageDetail}> <Calendar size={16} color="#5388d8"/> {new Date(stage.date).toLocaleDateString("ru-RU")}</span>
                    )}
                    {stage.maxParticipants && (
                      <span className={styles.stageDetail}><Users size={16} color="#5388d8"/> До {stage.maxParticipants} участников</span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.stageActions}>
                <button
                  type="button"
                  onClick={() => moveStageUp(index)}
                  className={styles.moveButton}
                  disabled={index === 0}
                  title="Переместить вверх"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveStageDown(index)}
                  className={styles.moveButton}
                  disabled={index === stages.length - 1}
                  title="Переместить вниз"
                >
                  <MoveDown size={16} />
                </button>
                <button type="button" onClick={() => removeStage(index)} className={styles.removeButton}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.addStage}>
        <FormField label="Название этапа *" error={errors.name}>
          <input
            type="text"
            placeholder="Например: Отборочный тур"
            className={styles.stageInput}
            value={newStage.name}
            onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
          />
        </FormField>

        <FormField label="Описание этапа (необязательно)">
          <textarea
            placeholder="Краткое описание этапа"
            className={styles.stageTextarea}
            value={newStage.description}
            onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
            rows={2}
          />
        </FormField>

        <div className={styles.stageRow}>
          <FormField label="Дата этапа (необязательно)">
            <input
              type="date"
              className={styles.stageInput}
              value={newStage.date}
              onChange={(e) => setNewStage({ ...newStage, date: e.target.value })}
            />
          </FormField>

          <FormField label="Макс. участников (необязательно)">
            <input
              type="number"
              placeholder="50"
              className={styles.stageInput}
              value={newStage.maxParticipants}
              onChange={(e) => setNewStage({ ...newStage, maxParticipants: e.target.value })}
              min="1"
            />
          </FormField>
        </div>

        <button type="button" onClick={addStage} className={styles.addStageButton}>
          <Plus size={16} />
          Добавить этап
        </button>
      </div>
    </div>
  )
}
