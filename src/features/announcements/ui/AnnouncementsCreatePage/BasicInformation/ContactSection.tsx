"use client"

import { useState } from "react"
import { FormField } from "@/shared/ui/FormField/FormField"
import { validateOptionalEmail, validateOptionalPhone, validateOptionalUrl } from "@/shared/lib/validation"
import type { AnnouncementContactInfo } from "@/entities/announcement/model"
import styles from "./ContactSection.module.css"

interface ContactSectionProps {
  contactInfo: AnnouncementContactInfo
  onContactUpdate: (field: keyof AnnouncementContactInfo, value: string) => void
}

export function ContactSection({ contactInfo, onContactUpdate }: ContactSectionProps) {
  const [errors, setErrors] = useState<{
    email?: string
    phone?: string
    website?: string
  }>({})

  const validateField = (field: string, value: string) => {
    let validation: true | string = true

    switch (field) {
      case "email":
        validation = validateOptionalEmail(value)
        break
      case "phone":
        validation = validateOptionalPhone(value)
        break
      case "website":
        validation = validateOptionalUrl(value)
        break
    }

    setErrors((prev) => ({
      ...prev,
      [field]: validation === true ? undefined : validation,
    }))
  }

  return (
    <div className={styles.contactSection}>
      <div className={styles.row}>
        <FormField label="Веб-сайт" error={errors.website}>
          <input
            type="url"
            className={styles.input}
            placeholder="https://..."
            value={contactInfo.website || ""}
            onChange={(e) => onContactUpdate("website", e.target.value)}
            onBlur={(e) => validateField("website", e.target.value)}
          />
        </FormField>

        <FormField label="Email для связи" error={errors.email}>
          <input
            type="email"
            className={styles.input}
            placeholder="contact@example.com"
            value={contactInfo.email || ""}
            onChange={(e) => onContactUpdate("email", e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Телефон для связи" error={errors.phone}>
        <input
          type="tel"
          className={styles.input}
          placeholder="+7 (999) 123-45-67"
          value={contactInfo.phone || ""}
          onChange={(e) => onContactUpdate("phone", e.target.value)}
          onBlur={(e) => validateField("phone", e.target.value)}
        />
      </FormField>
    </div>
  )
}
