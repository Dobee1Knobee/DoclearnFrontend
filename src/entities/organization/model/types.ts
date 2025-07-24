// Типы для организаций

export interface OrganizationResponsiblePerson {
  /** ФИО руководителя или уполномоченного менеджера */
  fullName: string
  /** Должность */
  position: string
  /** Контактный e‑mail */
  email: string
  /** Контактный телефон */
  phone: string
}

export interface Organization {
  id: string
  role: "organization"

  // --- Основная информация ---
  /** Полное наименование (по Уставу) */
  fullName: string
  /** Краткое описание деятельности */
  description?: string

  // --- Юридические данные ---
  /** Организационно-правовая форма (ООО, АО, НКО и т.д.) */
  legalForm: string
  /** Основной государственный регистрационный номер */
  ogrn: string
  /** ИНН (идентификационный номер налогоплательщика) */
  inn: string
  /** КПП (код причины постановки на учет) */
  kpp: string

  // --- Контактная информация ---
  /** Юридический адрес */
  legalAddress: string
  /** Фактический адрес */
  address: string
  /** Электронная почта для официальных уведомлений */
  notificationEmail: string
  /** Рабочий телефон */
  workPhone: string
  /** Веб-сайт */
  website?: string

  // --- Данные ответственного лица ---
  responsiblePerson: OrganizationResponsiblePerson

  // --- Связи ---
  /** ID пользователей, которые являются сотрудниками */
  members: string[]
  /** Подписчики и подписки организации */
  followers: string[]
  following: string[]

  createdAt: string

  // --- Верификация ---
  isVerified: boolean

  stats: OrganizationStats

  // --- Контент ---
  /** Публикации организации */
  publications: string[] // Post IDs
  /** Курсы организации */
  courses: string[] // Course IDs
}

// Union type для всех типов аккаунтов
export type AccountType = "specialist" | "organization"

// Статистика организации
export interface OrganizationStats {
  followersCount: number
  followingCount: number
  membersCount: number
  postsCount: number
  coursesCount: number
}
