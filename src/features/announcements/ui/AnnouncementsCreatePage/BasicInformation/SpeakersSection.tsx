"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { Speaker } from "@/entities/announcement/model"
import { FormField } from "@/shared/ui/FormField/FormField"
import { validateName } from "@/shared/lib/validation"
import styles from "./SpeakersSection.module.css"

interface SpeakersSectionProps {
  speakers: Speaker[]
  onUpdate: (speakers: Speaker[]) => void
}

export function SpeakersSection({ speakers, onUpdate }: SpeakersSectionProps) {
  const [newSpeaker, setNewSpeaker] = useState({ name: "", eventRole: "", bio: "", photo: "" })
  const [errors, setErrors] = useState<{ name?: string; eventRole?: string }>({})

  const validateSpeaker = () => {
    const newErrors: { name?: string; eventRole?: string } = {}

    // const nameValidation = validateName(newSpeaker.name)
    // if (nameValidation !== true) newErrors.name = nameValidation

    if (!newSpeaker.eventRole.trim()) newErrors.eventRole = "Роль спикера обязательна"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addSpeaker = () => {
    if (validateSpeaker()) {
      onUpdate([
        ...speakers,
        {
          userId: `temp-${Date.now()}`,
          name: newSpeaker.name.trim(),
          eventRole: newSpeaker.eventRole.trim(),
          bio: newSpeaker.bio.trim(),
          photo: newSpeaker.photo.trim(),
          status: "pending" as const,
        },
      ])
      setNewSpeaker({ name: "", eventRole: "", bio: "", photo: "" })
      setErrors({})
    }
  }

  const removeSpeaker = (index: number) => {
    onUpdate(speakers.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.speakersSection}>
      <label className={styles.label}>Спикеры</label>

      {speakers.map((speaker, index) => (
        <div key={index} className={styles.speakerItem}>
          <span className={styles.speakerInfo}>
            {speaker.name} - {speaker.eventRole}
          </span>
          <button type="button" onClick={() => removeSpeaker(index)} className={styles.removeSpeaker}>
            <X size={16} />
          </button>
        </div>
      ))}

      <div className={styles.addSpeaker}>
        <FormField label="ФИО спикера" error={errors.name}>
          <input
            type="text"
            placeholder="ФИО спикера"
            className={styles.speakerInput}
            value={newSpeaker.name}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
          />
        </FormField>

        <FormField label="Роль спикера" error={errors.eventRole}>
          <input
            type="text"
            placeholder="Роль спикера"
            className={styles.speakerInput}
            value={newSpeaker.eventRole}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, eventRole: e.target.value })}
          />
        </FormField>

        <button type="button" onClick={addSpeaker} className={styles.addSpeakerButton}>
          <Plus size={16} />
          Добавить спикера
        </button>
      </div>
    </div>
  )
}
