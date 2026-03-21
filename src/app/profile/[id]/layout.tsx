"use client"

import type React from "react"
import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProfileSidebar } from "@/features/profile-common/ui/ProfileSidebar/ProfileSidebar"
import styles from "./layout.module.css"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const userId = params.id as string

  return (
    <div className={styles.profileLayout}>
      <Suspense fallback={<div className={styles.sidebarPlaceholder} />}>
        <ProfileSidebar userId={userId} />
      </Suspense>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
