"use client"

import type React from "react"
import { useEffect } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { store } from "./store"
import { checkAuthStatus } from "@/features/auth/model/thunks"
import type { AppDispatch, RootState } from "./store"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, isInitialized])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
