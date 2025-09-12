"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { CreateAnnouncementFormData } from "@/entities/announcement/model"
import { FormField } from "@/shared/ui/FormField/FormField"
import { SpeakersSection } from "./SpeakersSection"
import { ContactSection } from "./ContactSection"
import { validateTitle, validateOrganizer, validateDate, validateTime } from "@/shared/lib/validation"
import { getFormLabels, getFieldsConfig } from "@/shared/lib/formLabels"
import styles from "./BasicInformation.module.css"

interface BasicInformationProps {
    formData: CreateAnnouncementFormData
    onUpdate: (updates: Partial<CreateAnnouncementFormData>) => void
    onNext: () => void
    onPrevious: () => void
}

export function BasicInformation({ formData, onUpdate, onNext, onPrevious }: BasicInformationProps) {
    const [errors, setErrors] = useState<{
        title?: string
        organizer?: string
        activeFrom?: string
        startTime?: string
        locationType?: string
    }>({})

    const [newMaterial, setNewMaterial] = useState("")
    const [newEquipment, setNewEquipment] = useState("")

    const labels = getFormLabels(formData.category || "conference")
    const fieldsConfig = getFieldsConfig(formData.category || "conference")

    const handleInputChange = (field: keyof CreateAnnouncementFormData, value: any) => {
        onUpdate({ [field]: value })
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleLocationChange = (field: keyof CreateAnnouncementFormData["location"], value: any) => {
        onUpdate({
            location: {
                ...formData.location,
                [field]: value,
            },
        })
        if (field === "type" && errors.locationType) {
            setErrors((prev) => ({ ...prev, locationType: undefined }))
        }
    }

    const handleContactChange = (field: keyof CreateAnnouncementFormData["contactInfo"], value: any) => {
        onUpdate({
            contactInfo: {
                ...formData.contactInfo,
                [field]: value,
            },
        })
    }

    const validateForm = () => {
        const newErrors: typeof errors = {}

        const titleValidation = validateTitle(formData.title)
        if (titleValidation !== true) newErrors.title = titleValidation

        const organizerValidation = validateOrganizer(formData.organizer)
        if (organizerValidation !== true) newErrors.organizer = organizerValidation

        const dateValidation = validateDate(formData.activeFrom)
        if (dateValidation !== true) newErrors.activeFrom = dateValidation

        const timeValidation = validateTime(formData.startTime)
        if (timeValidation !== true) newErrors.startTime = timeValidation

        if (!formData?.location?.type) {
            newErrors.locationType = "Выберите формат проведения"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    const handlePriceTypeChange = (checked: boolean) => {
        onUpdate({
            price_type: checked ? "free" : "paid",
            ...(checked && { price: 0, currency: "RUB" as const }),
        })
    }

    const addMaterial = () => {
        if (newMaterial.trim() && !(formData.materials || []).includes(newMaterial.trim())) {
            onUpdate({ materials: [...(formData.materials || []), newMaterial.trim()] })
            setNewMaterial("")
        }
    }

    const removeMaterial = (materialToRemove: string) => {
        onUpdate({ materials: (formData.materials || []).filter((material) => material !== materialToRemove) })
    }

    const handleMaterialKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addMaterial()
        }
    }

    const addEquipment = () => {
        if (newEquipment.trim() && !(formData.equipment || []).includes(newEquipment.trim())) {
            onUpdate({ equipment: [...(formData.equipment || []), newEquipment.trim()] })
            setNewEquipment("")
        }
    }

    const removeEquipment = (equipmentToRemove: string) => {
        onUpdate({ equipment: (formData.equipment || []).filter((equipment) => equipment !== equipmentToRemove) })
    }

    const handleEquipmentKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addEquipment()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Основная информация</h2>
            </div>

            <div className={styles.form}>
                <div className={styles.row}>
                    <FormField label={labels.title} required error={errors.title}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={`Введите ${labels.title.toLowerCase()}`}
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Организатор" required error={errors.organizer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Название организации"
                            value={formData.organizer}
                            onChange={(e) => handleInputChange("organizer", e.target.value)}
                        />
                    </FormField>
                </div>

                <div className={styles.row}>
                    <FormField label="Дата начала" required error={errors.activeFrom}>
                        <input
                            type="date"
                            className={styles.input}
                            value={formData.activeFrom}
                            onChange={(e) => handleInputChange("activeFrom", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Дата окончания">
                        <input
                            type="date"
                            className={styles.input}
                            value={formData.activeTo}
                            onChange={(e) => handleInputChange("activeTo", e.target.value)}
                        />
                    </FormField>
                </div>

                <div className={styles.row}>
                    <FormField label="Время начала" required error={errors.startTime}>
                        <input
                            type="time"
                            className={styles.input}
                            value={formData.startTime}
                            onChange={(e) => handleInputChange("startTime", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Время окончания">
                        <input
                            type="time"
                            className={styles.input}
                            value={formData.endTime}
                            onChange={(e) => handleInputChange("endTime", e.target.value)}
                        />
                    </FormField>
                </div>

                <div className={styles.row}>
                    <FormField label="Формат проведения" required error={errors.locationType}>
                        <select
                            className={styles.select}
                            value={formData?.location?.type || ""}
                            onChange={(e) => handleLocationChange("type", e.target.value)}
                        >
                            <option value="">Выберите формат</option>
                            <option value="offline">Очно</option>
                            <option value="online">Онлайн</option>
                            <option value="hybrid">Гибрид</option>
                        </select>
                    </FormField>

                    {fieldsConfig.showMaxParticipants && (
                        <FormField label={labels.maxParticipants}>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="Максимальное количество"
                                value={
                                    formData.category === "webinar" ? formData.participantLimit || "" : formData.
                                        maxParticipants || ""
                                }
                                onChange={(e) => {
                                    const value = e.target.value ? Number.parseInt(e.target.value) : null
                                    if (formData.category === "webinar") {
                                        handleInputChange("participantLimit", value)
                                    } else {
                                        handleInputChange("maxParticipants", value)
                                    }
                                }}
                            />
                        </FormField>
                    )}
                </div>

                {fieldsConfig.showProgram && (
                    <FormField label={labels.program}>
                        <textarea
                            className={styles.textarea}
                            placeholder={`Опишите ${labels.program.toLowerCase()}...`}
                            value={formData.program}
                            onChange={(e) => handleInputChange("program", e.target.value)}
                            rows={4}
                        />
                    </FormField>
                )}

                {formData.category === "masterclass" && (
                    <>
                        {fieldsConfig.showSkillLevel && (
                            <div className={styles.row}>
                                <FormField label="Уровень сложности">
                                    <select
                                        className={styles.select}
                                        value={formData.skillLevel || ""}
                                        onChange={(e) => handleInputChange("skillLevel", e.target.value)}
                                    >
                                        <option value="">Выберите уровень</option>
                                        <option value="beginner">Начинающий</option>
                                        <option value="intermediate">Средний</option>
                                        <option value="advanced">Продвинутый</option>
                                    </select>
                                </FormField>

                                {fieldsConfig.showDuration && (
                                    <FormField label="Продолжительность (часы)">
                                        <input
                                            type="number"
                                            className={styles.input}
                                            placeholder="Количество часов"
                                            value={formData.duration || ""}
                                            onChange={(e) =>
                                                handleInputChange("duration", e.target.value ? Number.parseInt(e.target.value) : null)
                                            }
                                        />
                                    </FormField>
                                )}
                            </div>
                        )}

                        {fieldsConfig.showEquipment && (
                            <FormField label="Предоставляемое оборудование">
                                <div className={styles.tagsContainer} style={{marginBottom: "1.25rem"}}>
                                    {(formData.equipment || []).length > 0 && (
                                        <div className={styles.tagsList}>
                                            {(formData.equipment || []).map((equipment) => (
                                                <div key={equipment} className={styles.tag}>
                                                    <span>{equipment}</span>
                                                    <button type="button" onClick={() => removeEquipment(equipment)} className={styles.removeTag}>
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
                                            placeholder="Добавить оборудование"
                                            value={newEquipment}
                                            onChange={(e) => setNewEquipment(e.target.value)}
                                            onKeyPress={handleEquipmentKeyPress}
                                        />
                                        <button type="button" onClick={addEquipment} className={styles.addTagButton}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </FormField>
                        )}

                        <div className={styles.checkboxRow}>
                            <div className={styles.checkboxField}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: "#5388d8" }}
                                        checked={formData.handsOn || false}
                                        onChange={(e) => handleInputChange("handsOn", e.target.checked)}
                                    />
                                    Практические занятия
                                </label>
                            </div>
                            <div className={styles.checkboxField}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: "#5388d8" }}
                                        checked={formData.groupWork || false}
                                        onChange={(e) => handleInputChange("groupWork", e.target.checked)}
                                    />
                                    Групповая работа
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {formData.category === "webinar" && (
                    <>
                        {fieldsConfig.showPlatform && (
                            <div className={styles.row}>
                                <FormField label="Платформа проведения">
                                    <select
                                        className={styles.select}
                                        value={formData.platform || ""}
                                        onChange={(e) => handleInputChange("platform", e.target.value)}
                                    >
                                        <option value="">Выберите платформу</option>
                                        <option value="zoom">Zoom</option>
                                        <option value="teams">Microsoft Teams</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="google_meet">Google Meet</option>
                                        <option value="yandex">Yandex Телемост</option>
                                        <option value="other">Другая</option>
                                    </select>
                                </FormField>

                                {fieldsConfig.showDuration && (
                                    <FormField label="Продолжительность (минуты)">
                                        <input
                                            type="number"
                                            className={styles.input}
                                            placeholder="Количество минут"
                                            value={formData.duration || ""}
                                            onChange={(e) =>
                                                handleInputChange("duration", e.target.value ? Number.parseInt(e.target.value) : null)
                                            }
                                        />
                                    </FormField>
                                )}
                            </div>
                        )}

                        {fieldsConfig.showRecording && (
                            <>
                                <div className={styles.checkboxRow}>
                                    <div className={styles.checkboxField}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                style={{ accentColor: "#5388d8" }}
                                                checked={formData.isRecorded || false}
                                                onChange={(e) => handleInputChange("isRecorded", e.target.checked)}
                                            />
                                            Запись вебинара будет доступна
                                        </label>
                                    </div>
                                </div>
                                {formData.isRecorded && (
                                    <div className={styles.row}>
                                        <FormField label="Ссылка на запись">
                                            <input
                                                type="url"
                                                className={styles.input}
                                                placeholder="https://..."
                                                value={formData.recordingLink || ""}
                                                onChange={(e) => handleInputChange("recordingLink", e.target.value)}
                                            />
                                        </FormField>
                                        <FormField label="Запись доступна до">
                                            <input
                                                type="date"
                                                className={styles.input}
                                                value={formData.recordingAvailableUntil || ""}
                                                onChange={(e) => handleInputChange("recordingAvailableUntil", e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {(formData.category === "masterclass" || formData.category === "webinar") && fieldsConfig.showPrerequisites && (
                    <FormField label="Предварительные требования">
                        <textarea
                            className={styles.textarea}
                            placeholder="Какие знания или навыки необходимы для участия..."
                            value={formData.prerequisites || ""}
                            onChange={(e) => handleInputChange("prerequisites", e.target.value)}
                            rows={3}
                        />
                    </FormField>
                )}

                {fieldsConfig.showMaterials && (
                    <FormField label="Материалы с вебинара">
                        <div className={styles.tagsContainer}>
                            {(formData.materials || []).length > 0 && (
                                <div className={styles.tagsList}>
                                    {(formData.materials || []).map((material) => (
                                        <div key={material} className={styles.tag}>
                                            <span>{material}</span>
                                            <button type="button" onClick={() => removeMaterial(material)} className={styles.removeTag}>
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
                                    placeholder="Добавить материал"
                                    value={newMaterial}
                                    onChange={(e) => setNewMaterial(e.target.value)}
                                    onKeyPress={handleMaterialKeyPress}
                                />
                                <button type="button" onClick={addMaterial} className={styles.addTagButton}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </FormField>
                )}

                {fieldsConfig.showSpeakers && (
                    <SpeakersSection
                        speakers={formData.speakers}
                        onUpdate={(speakers) => onUpdate({ speakers })}
                    />
                )}

                <div className={styles.checkboxRow}>
                    <div className={styles.checkboxField}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                style={{ accentColor: "#5388d8" }}
                                checked={formData.price_type === "free"}
                                onChange={(e) => handlePriceTypeChange(e.target.checked)}
                            />
                            Бесплатное участие
                        </label>
                    </div>

                    {fieldsConfig.showCertificates && (
                        <div className={styles.checkboxField}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    style={{ accentColor: "#5388d8" }}
                                    checked={formData.certificates}
                                    onChange={(e) => handleInputChange("certificates", e.target.checked)}
                                />
                                {labels.certificates}
                            </label>
                        </div>
                    )}
                </div>

                {formData.price_type === "paid" && (
                    <div className={styles.row}>
                        <FormField label="Стоимость участия">
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="0"
                                min="0"
                                value={formData.price || ""}
                                onChange={(e) => handleInputChange("price", Number(e.target.value))}
                            />
                        </FormField>
                        <FormField label="Валюта">
                            <select
                                className={styles.select}
                                value={formData.currency || "RUB"}
                                onChange={(e) => handleInputChange("currency", e.target.value)}
                            >
                                <option value="RUB">₽ Рубли</option>
                                <option value="USD">$ Доллары</option>
                                <option value="EUR">€ Евро</option>
                            </select>
                        </FormField>
                    </div>
                )}

                <ContactSection
                    contactInfo={formData.contactInfo}
                    registrationLink={formData.registrationLink}
                    onContactUpdate={handleContactChange}
                    onRegistrationLinkUpdate={(value) => handleInputChange("registrationLink", value)}
                />

                <div className={styles.actions}>
                    <button onClick={onPrevious} className={styles.backButton}>
                        Назад
                    </button>
                    <button onClick={handleNext} className={styles.nextButton}>
                        Далее
                    </button>
                </div>
            </div>
        </div>
    )
}
