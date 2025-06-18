// src/app/reset-password/page.tsx
import type { Metadata } from "next";

// Форсируем динамический рендеринг и игнорируем статическую генерацию
export const dynamic = "force-dynamic";

// Метаданные страницы
export const metadata: Metadata = {
  title: "Сброс пароля | DocLearn",
};

import { ResetPasswordPage } from "@/features/auth/passwordRecovery/ui/ResetPasswordPage/page";

// Серверный компонент, рендерящий клиентский
export default function ResetPasswordRoute() {
  return <ResetPasswordPage />;
}
