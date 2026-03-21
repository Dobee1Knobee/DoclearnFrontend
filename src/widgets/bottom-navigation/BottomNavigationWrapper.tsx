"use client"

import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated } from "@/features/auth/model/selectors"
import { usePathname } from "next/navigation"
import BottomNavigation from "./BottomNavigation"

export default function BottomNavigationWrapper() {
  const pathname = usePathname()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (pathname.startsWith("/profile/") || pathname === "/profile-demo" || pathname === "/Feed") {
    return null
  }

  return <BottomNavigation isAuthenticated={isAuthenticated} />
}
