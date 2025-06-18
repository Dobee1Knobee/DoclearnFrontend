"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { validateResetToken } from "../../model/thunks"
import { resetState } from "../../model/slice"
import { selectIsLoading, selectError, selectTokenValid } from "../../model/selectors"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { Spinner, Alert } from "react-bootstrap"

export function ResetPasswordPage() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const tokenValid = useAppSelector(selectTokenValid)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(resetState())
  }, [dispatch])

  useEffect(() => {
    if (mounted && token) {
      dispatch(validateResetToken({ token }))
    }
  }, [mounted, token, dispatch])

  if (!mounted) {
    return null
  }

  if (!token) {
    return (
      <div className="container" style={{ maxWidth: "500px", marginTop: "8rem" }}>
        <Alert variant="danger" className="text-center">
          <h4>Недействительная ссылка</h4>
          <p>Ссылка для восстановления пароля недействительна или повреждена.</p>
          <a href="/" className="btn btn-primary">
            Вернуться на главную
          </a>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container text-center" style={{ marginTop: "8rem" }}>
        <Spinner animation="border" role="status" style={{ color: "#5388d8" }}>
          <span className="visually-hidden">Проверка ссылки...</span>
        </Spinner>
        <p className="mt-3">Проверка ссылки для восстановления пароля...</p>
      </div>
    )
  }

  if (error || !tokenValid) {
    return (
      <div className="container" style={{ maxWidth: "500px", marginTop: "8rem" }}>
        <Alert variant="danger" className="text-center">
          <h4>Ссылка недействительна</h4>
          <p>{error || "Ссылка для восстановления пароля истекла или недействительна."}</p>
          <p>Пожалуйста, запросите новую ссылку для восстановления пароля.</p>
          <a href="/" className="btn btn-primary">
            Вернуться на главную
          </a>
        </Alert>
      </div>
    )
  }

  return <ResetPasswordForm token={token} />
}
