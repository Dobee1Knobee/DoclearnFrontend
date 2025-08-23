"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { selectUser, selectIsInitialized } from "@/features/auth/model/selectors"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const PUBLIC_ROUTES = ["/blocked"]

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = useSelector(selectUser)
  const isInitialized = useSelector(selectIsInitialized)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isInitialized) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (user?.isBanned && !isPublicRoute) {
      router.push("/blocked")
      return
    }

    if (!user?.isBanned && pathname === "/blocked") {
      router.push("/")
      return
    }
  }, [user, isInitialized, pathname, router])

  return <>{children}</>
}
