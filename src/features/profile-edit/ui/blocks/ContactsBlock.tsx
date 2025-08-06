"use client"

import type React from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, Mail, Phone, Globe, MessageCircle } from "lucide-react"
import { Telegram, Whatsapp, Facebook, Instagram, Twitter } from "iconoir-react"
import type { Contact, SpecialistUser } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"
import { useState, useEffect } from "react"
import { validateEmail, validatePhone, validateUrl } from "@/shared/lib/validation"

interface ContactTouched {
  [key: string]: {
    value?: boolean
    type?: boolean
  }
}

type ProfileKeys = keyof SpecialistUser

interface ContactsBlockProps {
  contacts: Contact[]
  onChange: (field: ProfileKeys, value: any) => void
  onValidationChange?: (hasErrors: boolean) => void
  attemptedSave?: boolean
}

const contactTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Телефон", icon: Phone },
  { value: "website", label: "Веб-сайт", icon: Globe },
  { value: "telegram", label: "Telegram", icon: Telegram },
  { value: "whatsapp", label: "WhatsApp", icon: Whatsapp },
  { value: "vk", label: "VKontakte", icon: MessageCircle },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "instagram", label: "Instagram", icon: Instagram },
]

export const ContactsBlock: React.FC<ContactsBlockProps> = ({
  contacts = [],
  onChange,
  onValidationChange,
  attemptedSave = false,
}) => {
  const [touchedFields, setTouchedFields] = useState<ContactTouched>({})

  useEffect(() => {
    checkValidation(contacts, touchedFields)
  }, [attemptedSave])

  const handleFieldBlur = (index: number, fieldName: "value" | "type") => {
    const newTouchedFields = {
      ...touchedFields,
      [index]: {
        ...touchedFields[index],
        [fieldName]: true,
      },
    }
    setTouchedFields(newTouchedFields)
    checkValidation(contacts, newTouchedFields)
  }

  const validateContactItem = (contact: Contact, index: number, touched: ContactTouched) => {
    const errors: Record<string, string> = {}
    const fieldTouched = touched[index] || {}

    if (fieldTouched.value || attemptedSave) {
      if (!contact.value.trim()) {
        errors.value = "Значение обязательно"
        return errors
      }

      switch (contact.type) {
        case "email":
          const emailValidation = validateEmail(contact.value)
          if (emailValidation !== true) {
            errors.value = emailValidation
          }
          break
        case "phone":
          const phoneValidation = validatePhone(contact.value)
          if (phoneValidation !== true) {
            errors.value = phoneValidation
          }
          break
        case "website":
          const urlValidation = validateUrl(contact.value)
          if (urlValidation !== true) {
            errors.value = urlValidation
          }
          break
      }
    }

    return errors
  }

  const checkValidation = (contactsList: Contact[], touched: ContactTouched) => {
    let hasErrors = false

    contactsList.forEach((contact, index) => {
      const errors = validateContactItem(contact, index, touched)
      if (Object.keys(errors).length > 0) {
        hasErrors = true
      }
    })

    if (attemptedSave) {
      contactsList.forEach((contact) => {
        if (!contact.value.trim()) {
          hasErrors = true
        }
      })
    }

    onValidationChange?.(hasErrors)
  }

  const addContact = () => {
    const newContact: Contact = {
      _id: `temp_${Date.now()}`,
      type: "email",
      label: "Email",
      value: "",
      isPublic: true,
    }
    onChange("contacts", [...contacts, newContact])
  }

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    onChange("contacts", newContacts)

    const newTouchedFields = { ...touchedFields }
    delete newTouchedFields[index]

    const reindexedTouchedFields: ContactTouched = {}
    Object.keys(newTouchedFields).forEach((key) => {
      const oldIndex = Number.parseInt(key)
      if (oldIndex > index) {
        reindexedTouchedFields[oldIndex - 1] = newTouchedFields[oldIndex]
      } else if (oldIndex < index) {
        reindexedTouchedFields[oldIndex] = newTouchedFields[oldIndex]
      }
    })

    setTouchedFields(reindexedTouchedFields)
    checkValidation(newContacts, reindexedTouchedFields)
  }

  const updateContact = (index: number, field: keyof Contact, value: any) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    onChange("contacts", newContacts)
    checkValidation(newContacts, touchedFields)
  }

  const updateContactType = (index: number, typeValue: string) => {
    const contactType = contactTypes.find((t) => t.value === typeValue)
    const newContacts = [...contacts]
    newContacts[index] = {
      ...newContacts[index],
      type: typeValue,
      label: contactType?.label || typeValue,
    }
    onChange("contacts", newContacts)
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5")
    }
    return value
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Контакты</h3>
        <button className={styles.addButton} onClick={addContact}>
          <Plus size={16} />
          Добавить контакт
        </button>
      </div>

      {contacts.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Контакты не добавлены. Нажмите &quot;Добавить контакт&quot;.
        </Alert>
      )}

      <div className={styles.contactsList}>
        {contacts.map((contact, index) => {
          const contactType = contactTypes.find((t) => t.value === contact.type)
          const Icon = contactType?.icon || MessageCircle
          const error = validateContactItem(contact, index, touchedFields).value

          return (
            <div key={contact._id || index} className={styles.contactItem}>
              <div className={styles.contactHeader}>
                <Icon size={16} className={styles.contactIcon} />
                <Form.Select
                  value={contact.type}
                  onChange={(e) => updateContactType(index, e.target.value)}
                  className={styles.contactTypeSelect}
                >
                  {contactTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeContact(index)}
                  className={styles.removeButton}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className={styles.contactFields}>
                <Form.Group>
                  <Form.Label className={styles.label}>Значение</Form.Label>
                  <Form.Control
                    type={contact.type === "email" ? "email" : contact.type === "phone" ? "tel" : "text"}
                    value={contact.value}
                    onChange={(e) => {
                      let value = e.target.value
                      if (contact.type === "phone") {
                        value = formatPhoneNumber(value)
                      }
                      updateContact(index, "value", value)
                    }}
                    onBlur={() => handleFieldBlur(index, "value")}
                    className={`${styles.input} ${validateContactItem(contact, index, touchedFields).value ? styles.inputError : ""}`}
                    placeholder={
                      contact.type === "email"
                        ? "example@email.com"
                        : contact.type === "phone"
                          ? "+7 (999) 123-45-67"
                          : contact.type === "website"
                            ? "https://example.com"
                            : "Введите значение"
                    }
                  />
                  {validateContactItem(contact, index, touchedFields).value && (
                    <div className={styles.errorText}>{validateContactItem(contact, index, touchedFields).value}</div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.label}>Подпись (необязательно)</Form.Label>
                  <Form.Control
                    type="text"
                    value={contact.label || ""}
                    onChange={(e) => updateContact(index, "label", e.target.value)}
                    className={styles.input}
                    placeholder="Например: Рабочий телефон"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    id={`public-${index}`}
                    label="Показывать публично"
                    checked={contact.isPublic !== false}
                    onChange={(e) => updateContact(index, "isPublic", e.target.checked)}
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
