"use client"

import type React from "react"
import { Modal } from "react-bootstrap"
import { X, Mail, Phone, Globe, MessageCircle, } from "lucide-react"
import { Telegram, Whatsapp, Facebook, Instagram, Twitter } from "iconoir-react"
import type { Contact } from "@/entities/user/model/types"
import styles from "./ContactsModal.module.css"

interface ContactsModalProps {
  show: boolean
  onHide: () => void
  contacts: Contact[]
  isOwner: boolean
  title: string
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ show, onHide, contacts, isOwner, title }) => {
  const displayContacts = isOwner
    ? contacts.filter((contact) => contact && contact.type && contact.value)
    : contacts.filter((contact) => contact && contact.type && contact.value && contact.isPublic !== false)

  const getContactIcon = (type: string) => {
    if (!type) return MessageCircle

    switch (type.toLowerCase()) {
      case "email":
        return Mail
      case "phone":
        return Phone
      case "website":
        return Globe
      case "telegram":
        return Telegram
      case "whatsapp":
        return Whatsapp
      case "vk":
        return MessageCircle
      case "facebook":
        return Facebook
      case "twitter":
        return Twitter
      case "instagram":
        return Instagram
      default:
        return MessageCircle
    }
  }

  const getContactTypeLabel = (type: string) => {
    if (!type) return "Контакт"

    switch (type.toLowerCase()) {
      case "email":
        return "Email"
      case "phone":
        return "Телефон"
      case "website":
        return "Веб-сайт"
      case "telegram":
        return "Telegram"
      case "whatsapp":
        return "WhatsApp"
      case "vk":
        return "VKontakte"
      case "facebook":
        return "Facebook"
      case "twitter":
        return "Twitter"
      case "instagram":
        return "Instagram"
      default:
        return type
    }
  }

  const getContactHref = (contact: Contact) => {
    if (!contact.type || !contact.value) return "#"

    switch (contact.type.toLowerCase()) {
      case "email":
        return `mailto:${contact.value}`
      case "phone":
        return `tel:${contact.value}`
      case "website":
        return contact.value.startsWith("http") ? contact.value : `https://${contact.value}`
      case "telegram":
        return `https://t.me/${contact.value.replace(/^@/, "")}`
      case "whatsapp":
        return `https://wa.me/${contact.value.replace(/\D/g, "")}`
      case "vk":
        return `https://vk.com/${contact.value}`
      case "facebook":
        return `https://www.facebook.com/${contact.value}`
      case "twitter":
        return `https://twitter.com/${contact.value.replace(/^@/, "")}`
      case "instagram":
        return `https://www.instagram.com/${contact.value.replace(/^@/, "")}`
      default:
        return contact.value
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered className={styles.customModal} backdrop="static">
      <button type="button" className={styles.closeButton} onClick={onHide} aria-label="Закрыть">
        <X size={20} />
      </button>

      <Modal.Body>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{title}</h2>

          {displayContacts.length === 0 ? (
            <div className={styles.emptyState}>
              <MessageCircle size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>{isOwner ? "У вас пока нет контактов" : "Контакты не указаны"}</p>
            </div>
          ) : (
            <div className={styles.contactsList}>
              {displayContacts.map((contact) => {
                const Icon = getContactIcon(contact.type)
                const href = getContactHref(contact)
                const isExternal = contact.type?.toLowerCase() === "website" ||
                  contact.type?.toLowerCase() === "telegram" ||
                  contact.type?.toLowerCase() === "whatsapp" ||
                  contact.type?.toLowerCase() === "vk" ||
                  contact.type?.toLowerCase() === "facebook" ||
                  contact.type?.toLowerCase() === "twitter" ||
                  contact.type?.toLowerCase() === "instagram"
                const typeLabel = getContactTypeLabel(contact.type)
                const displayLabel = contact.label || typeLabel

                return (
                  <a
                    key={contact._id}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={styles.contactItem}
                  >
                    <div className={styles.contactHeader}>
                      <span className={styles.iconWrapper}>
                        <Icon size={20} />
                      </span>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactType}>{typeLabel}</div>
                        <div className={styles.contactLabel}>{displayLabel}</div>
                      </div>
                    </div>
                    <div className={styles.contactValue}>{contact.value}</div>
                    {isOwner && (
                      <div className={styles.visibilityBadge}>
                        {contact.isPublic !== false ? "Публичный" : "Приватный"}
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
