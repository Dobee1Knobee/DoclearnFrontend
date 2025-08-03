"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser, selectIsAuthenticated } from "@/features/auth/model/selectors"
import { Spinner } from "react-bootstrap"
import { NewProfileEditForm } from "./NewProfileEditForm"

interface NewProfileEditPageProps {
  userId: string
}

export const NewProfileEditPage: React.FC<NewProfileEditPageProps> = ({ userId }) => {
  const router = useRouter()
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/")
      return
    }

    if (mounted && currentUser && currentUser._id !== userId) {
      router.push(`/profile/${userId}`)
      return
    }
  }, [mounted, isAuthenticated, currentUser, userId, router])

  if (!mounted) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" style={{ color: "#5388d8" }} />
        <p className="mt-3">Загрузка...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (currentUser?._id !== userId) {
    return null
  }

  return <NewProfileEditForm profile={currentUser} />
}
