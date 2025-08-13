"use client"

import type React from "react"
import Image from "next/image"
import styles from "./SearchResultItem.module.css"
import type { SearchUser } from "../model/types"

interface SearchResultItemProps {
  user: SearchUser
  isSelected: boolean
  onClick: () => void
}

const getRoleInRussian = (role: string): string => {
  switch (role) {
    case "student":
      return "Студент"
    case "resident":
      return "Ординатор"
    case "postgraduate":
      return "Аспирант"
    case "doctor":
      return "Врач"
    case "researcher":
      return "Научный сотрудник"
    case "admin":
      return "Администратор"
    case "owner":
      return "Владелец"
    default:
      return role
  }
}
export const SearchResultItem: React.FC<SearchResultItemProps> = ({ user, isSelected, onClick }) => {
  const fullName = `${user.lastName} ${user.firstName} ${user.middleName || ""}`.trim()
  const avatarSrc = user.avatarUrl || user.defaultAvatarPath 
  const mainSpecializations = user.specializations?.filter((spec) => spec.main) || []
  const specializationText = mainSpecializations.map((spec) => spec.name).join(", ")

  return (
    <div className={`${styles.resultItem} ${isSelected ? styles.selected : ""}`} onClick={onClick}>
      <div className={styles.avatar}>
        <Image
          src={avatarSrc || "/Avatars/Avatar1.webp"}
          alt={fullName}
          width={40}
          height={40}
          className={styles.avatarImage}
        />
      </div>

      <div className={styles.userInfo}>
        <div className={styles.name}>{fullName}</div>
        <div className={styles.details}>
          <span className={styles.role}>{getRoleInRussian(user.role)}</span>
          {specializationText && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.specialization}>{specializationText}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
