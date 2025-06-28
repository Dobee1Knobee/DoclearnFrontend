"use client"

import type React from "react"
import type { AuthorProfile } from "@/entities/user/model/types"
import { Mail, Phone, Globe, MessageCircle } from "lucide-react"
import styles from "./ContactsTab.module.css"

interface ContactsTabProps {
  profile: AuthorProfile
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ profile }) => {
  const { contacts } = profile

  if (!contacts.length) {
    return <div className={styles.empty}>Не указано</div>
  }

  const getContactIcon = (type: string) => {
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

  const getContactHref = (contact: any) => {
    switch (contact.type.toLowerCase()) {
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
      {contacts.map((contact, index) => {
        const Icon = getContactIcon(contact.type)
        const href = getContactHref(contact)
        const isExternal = contact.type.toLowerCase() === "website"

        return (
          <a
            key={`${contact.type}-${index}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={styles.item}
          >
            <span className={styles.iconWrapper}>
              <Icon size={16} />
            </span>
            <span className={styles.link}>{contact.label || contact.value}</span>
          </a>
        )
      })}
    </div>
  )
}

// 'use client'

// import React from 'react'
// import type { AuthorProfile } from '@/entities/user/model/types'
// import {
//   Mail,
//   Phone,
//   Globe,
//   MessageCircle,
// } from 'lucide-react'
// import styles from './ContactsTab.module.css'

// interface ContactsTabProps {
//   profile: AuthorProfile;
// }

// export const ContactsTab: React.FC<ContactsTabProps> = ({ profile }) => {
//   const { contacts } = profile;

//   if (!contacts.length) {
//     return <div className={styles.empty}>Контакты отсутствуют</div>;
//   }

//   return (
//     <div className={styles.container}>
//       {contacts.map((c) => {
//         const Icon =
//           c.type === 'email'
//             ? Mail
//             : c.type === 'phone'
//             ? Phone
//             : c.type === 'website'
//             ? Globe
//             : MessageCircle;
//         const href =
//           c.type === 'email'
//             ? `mailto:${c.value}`
//             : c.type === 'phone'
//             ? `tel:${c.value}`
//             : c.value;
//         return (
//           <a
//             key={c.value}
//             href={href}
//             target={c.type === 'website' ? '_blank' : undefined}
//             rel={c.type === 'website' ? 'noopener noreferrer' : undefined}
//             className={styles.item}
//           >
//             <span className={styles.iconWrapper}>
//               <Icon size={16} />
//             </span>
//             <span className={styles.link}>{c.label || c.value}</span>
//           </a>
//         );
//       })}
//     </div>
//   );
// };
