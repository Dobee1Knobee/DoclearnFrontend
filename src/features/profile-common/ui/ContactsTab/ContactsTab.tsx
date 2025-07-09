"use client"

import type React from "react"
import type { Contact } from "@/entities/user/model/types"
import { Mail, Phone, Globe, MessageCircle } from "lucide-react"
import styles from "./ContactsTab.module.css"

interface ContactsTabProps {
  contacts: Contact[]
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contacts }) => {
  // Показываем только публичные контакты и фильтруем некорректные данные
  const publicContacts = contacts.filter(
    (contact) => contact && contact.type && contact.type.type && contact.value && contact.isPublic !== false,
  )

  if (publicContacts.length === 0) {
    return <div className={styles.empty}>Не указано</div>
  }

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
      case "whatsapp":
        return MessageCircle
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
    if (!contact.type?.type || !contact.value) return "#"

    switch (contact.type.type.toLowerCase()) {
      case "email":
        return `mailto:${contact.value}`
      case "phone":
        return `tel:${contact.value}`
      case "website":
        return contact.value.startsWith("http") ? contact.value : `https://${contact.value}`
      default:
        return contact.value
    }
  }

  return (
    <div className={styles.container}>
      {publicContacts.map((contact, index) => {
        const Icon = getContactIcon(contact.type.type)
        const href = getContactHref(contact)
        const isExternal = contact.type.type?.toLowerCase() === "website"
        const typeLabel = getContactTypeLabel(contact.type.type)
        const displayLabel = contact.type.label || typeLabel

        return (
          <a
            key={`${contact.type.type || "contact"}-${index}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={styles.item}
          >
            <div className={styles.itemHeader}>
              <span className={styles.iconWrapper}>
                <Icon size={16} />
              </span>
              <span className={styles.contactType}>{typeLabel}</span>
            </div>
            <div className={styles.contactLabel}>{displayLabel}</div>
            <div className={styles.contactValue}>{contact.value}</div>
          </a>
        )
      })}
    </div>
  )
}

// "use client"

// import type React from "react"
// import type { AuthorProfile } from "@/entities/user/model/types"
// import { Mail, Phone, Globe, MessageCircle } from "lucide-react"
// import styles from "./ContactsTab.module.css"

// interface ContactsTabProps {
//   profile: AuthorProfile
// }

// export const ContactsTab: React.FC<ContactsTabProps> = ({ profile }) => {
//   const { contacts } = profile

//   if (!contacts.length) {
//     return <div className={styles.empty}>Не указано</div>
//   }

//   const getContactIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case "email":
//         return Mail
//       case "phone":
//         return Phone
//       case "website":
//         return Globe
//       case "telegram":
//       case "whatsapp":
//         return MessageCircle
//       default:
//         return MessageCircle
//     }
//   }

//   const getContactTypeLabel = (type: string) => {
//     switch (type.toLowerCase()) {
//       case "email":
//         return "Email"
//       case "phone":
//         return "Телефон"
//       case "website":
//         return "Веб-сайт"
//       case "telegram":
//         return "Telegram"
//       case "whatsapp":
//         return "WhatsApp"
//       case "vk":
//         return "VKontakte"
//       case "facebook":
//         return "Facebook"
//       case "twitter":
//         return "Twitter"
//       case "instagram":
//         return "Instagram"
//       default:
//         return type
//     }
//   }

//   const getContactHref = (contact: any) => {
//     switch (contact.type.toLowerCase()) {
//       case "email":
//         return `mailto:${contact.value}`
//       case "phone":
//         return `tel:${contact.value}`
//       case "website":
//         return contact.value.startsWith("http") ? contact.value : `https://${contact.value}`
//       default:
//         return contact.value
//     }
//   }

//   return (
//     <div className={styles.container}>
//       {contacts.map((contact, index) => {
//         const Icon = getContactIcon(contact.type.type)
//         const href = getContactHref(contact)
//         const isExternal = contact.type.type.toLowerCase() === "website"
//         const typeLabel = getContactTypeLabel(contact.type.type)
//         const displayLabel = contact.type.label || typeLabel

//         return (
//           <a
//             key={`${contact.type}-${index}`}
//             href={href}
//             target={isExternal ? "_blank" : undefined}
//             rel={isExternal ? "noopener noreferrer" : undefined}
//             className={styles.item}
//           >
//             <div className={styles.itemHeader}>
//               <span className={styles.iconWrapper}>
//                 <Icon size={16} />
//               </span>
//               <span className={styles.contactType}>{typeLabel}</span>
//             </div>
//             <div className={styles.contactLabel}>{displayLabel}</div>
//             <div className={styles.contactValue}>{contact.value}</div>
//           </a>
//         )
//       })}
//     </div>
//   )
// }


