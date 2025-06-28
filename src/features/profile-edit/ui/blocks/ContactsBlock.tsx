"use client"

import type React from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { Plus, Trash2, Mail, Phone, Globe, MessageCircle } from "lucide-react"
import type { Contact, AuthorProfile } from "@/entities/user/model/types"
import styles from "./FormBlock.module.css"

interface ContactsBlockProps {
  contacts: Contact[]
  onChange: (field: keyof AuthorProfile, value: any) => void
}

const contactTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Телефон", icon: Phone },
  { value: "website", label: "Веб-сайт", icon: Globe },
  { value: "telegram", label: "Telegram", icon: MessageCircle },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "vk", label: "VKontakte", icon: MessageCircle },
  { value: "facebook", label: "Facebook", icon: MessageCircle },
  { value: "twitter", label: "Twitter", icon: MessageCircle },
  { value: "instagram", label: "Instagram", icon: MessageCircle },
]

export const ContactsBlock: React.FC<ContactsBlockProps> = ({ contacts = [], onChange }) => {


  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    onChange("contacts", newContacts)
  }

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    onChange("contacts", newContacts)
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5")
    }
    return value
  }

  const validateContact = (contact: Contact) => {
    if (!contact.value.trim()) return "Значение обязательно"

    switch (contact.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(contact.value) ? "" : "Некорректный email"
      case "phone":
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/
        return phoneRegex.test(contact.value) ? "" : "Некорректный номер телефона"
      case "website":
        try {
          new URL(contact.value.startsWith("http") ? contact.value : `https://${contact.value}`)
          return ""
        } catch {
          return "Некорректный URL"
        }
      default:
        return ""
    }
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Контакты</h3>
        <button className={styles.addButton} >
          <Plus size={16} />
          Добавить контакт
        </button>
      </div>

      {contacts.length === 0 && (
        <Alert variant="light" className={styles.emptyState}>
          Контакты не добавлены. Нажмите "Добавить контакт".
        </Alert>
      )}

      <div className={styles.contactsList}>
        {contacts.map((contact, index) => {
          const contactType = contactTypes.find((t) => t.value === contact.type)
          const Icon = contactType?.icon || MessageCircle
          const error = validateContact(contact)

          return (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactHeader}>
                <Icon size={16} className={styles.contactIcon} />
                <Form.Select
                  value={contact.type}
                  onChange={(e) => updateContact(index, "type", e.target.value)}
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
                  <Form.Label className={styles.label}>Значение *</Form.Label>
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
                    className={`${styles.input} ${error ? styles.inputError : ""}`}
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
                  {error && <div className={styles.errorText}>{error}</div>}
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
