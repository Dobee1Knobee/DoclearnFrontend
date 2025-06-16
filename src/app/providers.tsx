"use client"

import type React from "react"
import { useEffect } from "react"
import { Provider, useDispatch } from "react-redux"
import { store } from "./store"
import { checkAuthStatus } from "@/features/auth/model/thunks"
import type { AppDispatch } from "./store"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  // useEffect(() => {
  //   dispatch(checkAuthStatus())
  // }, [dispatch])
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
