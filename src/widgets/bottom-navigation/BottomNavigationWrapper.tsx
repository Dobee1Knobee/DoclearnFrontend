"use client"

import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated } from "@/features/auth/model/selectors"
import BottomNavigation from "./BottomNavigation"

export default function BottomNavigationWrapper() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return <BottomNavigation isAuthenticated={isAuthenticated} />
}
