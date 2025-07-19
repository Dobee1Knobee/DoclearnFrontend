import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Сброс пароля | DocLearn",
}

import { ResetPasswordPage } from "@/features/auth/passwordRecovery/ui/ResetPasswordPage/page"

export default function ResetPasswordRoute() {
  return <ResetPasswordPage />
}
