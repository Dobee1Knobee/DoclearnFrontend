import { createAsyncThunk } from "@reduxjs/toolkit"
import http from "@/shared/api/http"
import type { ForgotPasswordDto, ResetPasswordDto, ValidateTokenDto } from "./types"

export const forgotPassword = createAsyncThunk<{ email: string }, ForgotPasswordDto>(
  "passwordRecovery/forgotPassword",
  async (dto, { rejectWithValue }) => {
    try {
      await http.post("/auth/request-password-reset", dto)
      return { email: dto.email }
    } catch (error: any) {
      if (error.response?.status === 429) {
        return rejectWithValue("Слишком много попыток. Попробуйте позже")
      }
      return rejectWithValue(error.response?.data?.message || error.message || "Ошибка при отправке письма")
    }
  },
)

export const validateResetToken = createAsyncThunk<void, { token: string }>(
  "passwordRecovery/validateResetToken",
  async ({ token }, { rejectWithValue }) => {
    try {
      await http.get("/auth/validate-token", { params: { token } });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message
          || "Недействительный или истёкший токен"
      );
    }
  },
);

export const resetPassword = createAsyncThunk<void, ResetPasswordDto>(
  "passwordRecovery/resetPassword",
  async (dto, { rejectWithValue }) => {
    try {
      await http.post("/auth/reset-password", dto)
    } catch (error: any) {
      if (error.response?.status === 429) {
        return rejectWithValue("Слишком много попыток. Попробуйте позже")
      }
      return rejectWithValue(error.response?.data?.message || error.message || "Ошибка при сбросе пароля")
    }
  },
)
