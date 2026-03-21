"use client"

import { ProfileHero } from "@/features/profile-common/ui/ProfileHero/ProfileHero"
import { ProfileContentRouter } from "@/features/profile-common/ui/ProfileContentRouter"
import { ProfileSkeleton } from "@/features/profile-common/ui/ProfileSkeleton/ProfileSkeleton"
import type { DoctorUser } from "@/entities/user/model/types"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import styles from "./page.module.css"

const mockProfile: DoctorUser = {
  _id: "demo123",
  firstName: "Алексей",
  lastName: "Иванов",
  middleName: "Сергеевич",
  email: "ivanov@doclearn.ru",
  birthday: "1985-03-15",
  role: "doctor",
  placeStudy: "",
  placeWork: "НМИЦ им. Н.Н. Бурденко",
  workHistory: [
    {
      id: "w1",
      organizationName: "НМИЦ им. Н.Н. Бурденко",
      position: "Нейрохирург",
      startDate: "2015-01-01",
      isCurrently: true,
    },
  ],
  isVerified: {
    user: true,
    doctor: true,
    student: false,
    resident: false,
    postgraduate: false,
    researcher: false,
  },
  isBanned: false,
  createdAt: "2023-01-10",
  defaultAvatarPath: "/Avatars/Avatar3.webp",
  location: "Москва, Россия",
  followers: [],
  following: [],
  rating: 1842,
  publications: [],
  bio: "Нейрохирург с 10-летним опытом работы. Специализируюсь на хирургии опухолей головного мозга и нейроонкологии.\n\nОкончил Первый МГМУ им. И.М. Сеченова. Прошёл ординатуру в НМИЦ нейрохирургии им. Н.Н. Бурденко.\n\nАвтор 25+ научных публикаций. Участник международных конференций по нейрохирургии.",
  achievements: [],
  stats: {
    followingCount: 48,
    followersCount: 312,
    postsCount: 14,
  },
  contacts: [
    { _id: "c1", type: "email", value: "ivanov@doclearn.ru", isPublic: true },
    { _id: "c2", type: "telegram", value: "@dr_ivanov", isPublic: true },
  ],
  documents: [
    {
      _id: "d1",
      file: "diploma.pdf",
      category: "higher_education_diploma",
      label: "Диплом Сеченовского университета",
      isPublic: true,
      isVerified: true,
      uploadedAt: "2023-02-01",
    },
    {
      _id: "d2",
      file: "cert.pdf",
      category: "specialist_certificate",
      label: "Сертификат нейрохирурга",
      isPublic: true,
      isVerified: true,
      uploadedAt: "2023-06-15",
    },
  ],
  experience: "10 лет",
  education: [
    {
      _id: "e1",
      institution: "Первый МГМУ им. И.М. Сеченова",
      degree: "Специалист",
      specialty: "Лечебное дело",
      startDate: "2003",
      graduationYear: "2009",
      isCurrently: false,
    },
    {
      _id: "e2",
      institution: "НМИЦ нейрохирургии им. Н.Н. Бурденко",
      degree: "Ординатура",
      specialty: "Нейрохирургия",
      startDate: "2009",
      graduationYear: "2011",
      isCurrently: false,
    },
    {
      _id: "e3",
      institution: "Первый МГМУ им. И.М. Сеченова",
      degree: "Аспирантура",
      specialty: "Нейрохирургия",
      startDate: "2011",
      graduationYear: "2015",
      isCurrently: false,
    },
  ],
  scientificStatus: {
    degree: null,
    title: null,
    rank: null,
    interests: ["нейроонкология", "хирургия основания черепа"],
  },
  specializations: [
    {
      specializationId: "s1",
      name: "Нейрохирургия",
      method: "Ординатура",
      qualificationCategory: "Высшая",
      main: true,
    },
  ],
} as unknown as DoctorUser

function DemoInner() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"

  return (
    <div className={styles.wrapper}>
      <ProfileHero profile={mockProfile} />
      <ProfileContentRouter profile={mockProfile} activeTab={activeTab} />
    </div>
  )
}

export default function ProfileDemoPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<ProfileSkeleton />}>
        <DemoInner />
      </Suspense>
    </div>
  )
}
