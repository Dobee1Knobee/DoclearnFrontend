'use client'

import React from 'react'
import type { AuthorProfile } from '@/entities/user/model/types'
import {
  Mail,
  Phone,
  Globe,
  MessageCircle,
} from 'lucide-react'
import styles from './ContactsTab.module.css'

interface ContactsTabProps {
  profile: AuthorProfile;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ profile }) => {
  const { contacts } = profile;

  if (!contacts.length) {
    return <div className={styles.empty}>Контакты отсутствуют</div>;
  }

  return (
    <div className={styles.container}>
      {contacts.map((c) => {
        const Icon =
          c.type === 'email'
            ? Mail
            : c.type === 'phone'
            ? Phone
            : c.type === 'website'
            ? Globe
            : MessageCircle;
        const href =
          c.type === 'email'
            ? `mailto:${c.value}`
            : c.type === 'phone'
            ? `tel:${c.value}`
            : c.value;
        return (
          <a
            key={c.value}
            href={href}
            target={c.type === 'website' ? '_blank' : undefined}
            rel={c.type === 'website' ? 'noopener noreferrer' : undefined}
            className={styles.item}
          >
            <span className={styles.iconWrapper}>
              <Icon size={16} />
            </span>
            <span className={styles.link}>{c.label || c.value}</span>
          </a>
        );
      })}
    </div>
  );
};
