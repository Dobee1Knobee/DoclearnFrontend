import { LogOut, Settings, FileText, Bookmark, User, Sun, MoonStar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { UserProfile, MenuItem } from "../../model/types"
import { DEFAULT_PROFILE } from "../../model/constants"
import styles from "./UserProfileCard.module.css"

interface UserProfileCardProps extends Partial<UserProfile> {
  onLogout?: () => void
}

export function UserProfileCard({
  name = DEFAULT_PROFILE.name,
  role = DEFAULT_PROFILE.role,
  avatar = DEFAULT_PROFILE.avatar,
  onLogout,
}: UserProfileCardProps) {
  const menuItems: MenuItem[] = [
    {
      label: "Мой профиль",
      href: "#",
      icon: <User className={styles.icon} />,
    },
    {
      label: "Сохраненное",
      href: "#",
      icon: <Bookmark className={styles.icon} />,
    },
    {
      label: "Обновления",
      href: "#",
      icon: <FileText className={styles.icon} />,
    },
    {
      label: "Тема оформления",
      href: "#",
      icon: <Sun className={styles.icon} />,
      value: "Светлая",
    },
    {
      label: "Настройки",
      href: "#",
      icon: <Settings className={styles.icon} />,
    },
  ]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
            <div className={styles.profileContent}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarContainer}>
                        <Image
                            src={avatar || "/placeholder.svg"}
                            alt={name}
                            width={64}
                            height={64}
                            className={styles.avatarImage}
                        />
                    </div>
                    <div className={styles.profileInfo}>
                    <h2 className={styles.profileName}>{name}</h2>
                    <p className={styles.profileRole}>{role}</p>
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.menuContainer}>
                    {menuItems.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.menuItem}>
                        <div className={styles.menuItemLeft}>
                        {item.icon}
                        <span className={styles.menuItemLabel}>{item.label}</span>
                        </div>
                        <div className={styles.menuItemRight}>
                        {item.value && <span className={styles.menuItemValue}>{item.value}</span>}
                        </div>
                    </Link>
                    ))}
                    <button type="button" className={`${styles.menuItem} ${styles.logoutButton}`} onClick={handleLogout}>
                    <div className={styles.menuItemLeft}>
                        <LogOut className={styles.icon} />
                        <span className={styles.menuItemLabel}>Выйти</span>
                    </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

