"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { CreateAnnouncementFormData, TargetAudience } from "@/entities/announcement/model"
import type { AnnouncementCategories } from "@/entities/announcement/model/conference"
import styles from "./AdditionalDetails.module.css"
import { getFormLabels } from "@/shared/lib/formLabels"

interface AdditionalDetailsProps {
    formData: CreateAnnouncementFormData
    onUpdate: (updates: Partial<CreateAnnouncementFormData>) => void
    onNext: () => void
    onPrevious: () => void
}

const targetAudienceOptions: { value: TargetAudience; label: string }[] = [
    { value: "doctors", label: "Врачи" },
    { value: "researchers", label: "Исследователи" },
    { value: "specialists", label: "Специалисты" },
    { value: "students", label: "Студенты медицинских вузов" },
    { value: "general", label: "Широкая аудитория" },
]

const categoriesOptions: { value: AnnouncementCategories; label: string }[] = [
    { value: "medical", label: "Медицина" },
    { value: "it", label: "IT и технологии" },
    { value: "educational", label: "Образование" },
    { value: "business", label: "Бизнес" },
    { value: "science", label: "Наука" },
    { value: "other", label: "Другое" },
]

export function AdditionalDetails({ formData, onUpdate, onNext, onPrevious }: AdditionalDetailsProps) {
    const [newTag, setNewTag] = useState("")
    const labels = getFormLabels(formData.category || "conference")


    const handleInputChange = (field: keyof CreateAnnouncementFormData, value: any) => {
        onUpdate({ [field]: value })
    }

    const handleLocationChange = (field: keyof CreateAnnouncementFormData["location"], value: any) => {
        onUpdate({
            location: {
                ...formData.location,
                [field]: value,
            },
        })
    }

    const handleTargetAudienceChange = (audience: TargetAudience, checked: boolean) => {
        const currentAudience = formData.targetAudience || []
        if (checked) {
            onUpdate({ targetAudience: [...currentAudience, audience] })
        } else {
            onUpdate({ targetAudience: currentAudience.filter((item) => item !== audience) })
        }
    }

    const handleCategoriesChange = (category: AnnouncementCategories, checked: boolean) => {
        const currentCategories = formData.categories || []
        if (checked) {
            onUpdate({ categories: [...currentCategories, category] })
        } else {
            onUpdate({ categories: currentCategories.filter((item) => item !== category) })
        }
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            onUpdate({ tags: [...formData.tags, newTag.trim()] })
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        onUpdate({ tags: formData.tags.filter((tag) => tag !== tagToRemove) })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Дополнительные детали</h2>
            </div>

            <div className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Описание мероприятия</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Подробное описание мероприятия, его целей и ожидаемых результатов..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={5}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Целевая аудитория</label>
                    <div className={styles.checkboxGrid}>
                        {targetAudienceOptions.map((option) => (
                            <label key={option.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    style={{ accentColor: '#5388d8' }}
                                    checked={formData.targetAudience.includes(option.value)}
                                    onChange={(e) => handleTargetAudienceChange(option.value, e.target.checked)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>{labels.categories}</label>
                    <div className={styles.checkboxGrid}>
                        {categoriesOptions.map((option) => (
                            <label key={option.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    style={{ accentColor: "#5388d8" }}
                                    checked={formData.categories?.includes(option.value) || false}
                                    onChange={(e) => handleCategoriesChange(option.value, e.target.checked)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Язык проведения</label>
                        <select
                            className={styles.select}
                            value={formData.language}
                            onChange={(e) => handleInputChange("language", e.target.value)}
                        >
                            <option value="ru">Русский</option>
                            <option value="en">Английский</option>
                            <option value="multi">Многоязычный</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Город проведения</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Москва"
                            value={formData.location.city || ""}
                            onChange={(e) => handleLocationChange("city", e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Адрес проведения</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Укажите точный адрес места проведения"
                        value={formData.location.address || ""}
                        onChange={(e) => handleLocationChange("address", e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Теги</label>
                    <div className={styles.tagsContainer}>
                        {formData.tags.length > 0 && (
                            <div className={styles.tagsList}>
                                {formData.tags.map((tag) => (
                                    <div key={tag} className={styles.tag}>
                                        <span>{tag}</span>
                                        <button type="button" onClick={() => removeTag(tag)} className={styles.removeTag}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={styles.addTag}>
                            <input
                                type="text"
                                className={styles.tagInput}
                                placeholder="Добавить тег"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button type="button" onClick={addTag} className={styles.addTagButton}>
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={onPrevious} className={styles.backButton}>
                        Назад
                    </button>
                    <button onClick={onNext} className={styles.nextButton}>
                        Далее
                    </button>
                </div>
            </div>
        </div>
    )
}
