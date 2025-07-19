import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import http from "@/shared/api/http"
import type { User } from "@/entities/user/model/types"
import type { LoginDto, RegisterDto, VerifyDto } from "./types"
import { clearAuthError, setRegistrationEmail } from "./slice"

interface RefreshTokenResponse {
  refreshToken: string
}

interface UserResponse {
  success: boolean
  data: User
}

interface ErrorResponse {
  message?: string
}

interface LoginResponse {
  user: User
  refreshToken: string
}

async function fetchProfile(): Promise<User> {
  const { data } = await http.get<UserResponse>("/user/me")
  console.log("Данные от /user/me:", data.data)
  return data.data
}

export const loginUser = createAsyncThunk<User, LoginDto, { rejectValue: string }>(
  "auth/loginUser",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<LoginResponse>("/auth/login", dto)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      return response.data.user
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          return rejectWithValue("Неверный логин или пароль")
        }
        return rejectWithValue((err.response.data as ErrorResponse)?.message ?? err.message)
      }
      return rejectWithValue((err as Error).message)
    }
  },
)

export const registerUser = createAsyncThunk<void, RegisterDto, { rejectValue: string }>(
  "auth/registerUser",
  async (dto, { dispatch, rejectWithValue }) => {
    try {
      await http.post("/auth/register", dto)
      dispatch(setRegistrationEmail(dto.email))
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        return rejectWithValue("Пользователь с такой почтой уже существует")
      }
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue((err.response.data as ErrorResponse)?.message ?? err.message)
      }
      return rejectWithValue((err as Error).message)
    }
  },
)

export const verifyUserEmail = createAsyncThunk<User, VerifyDto, { rejectValue: string }>(
  "auth/verifyUserEmail",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<LoginResponse>("/auth/verify-email", dto)
      console.log("verify-email: ",response)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      return response.data.user
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          return rejectWithValue("Неверный код подтверждения")
        }
        if (err.response.status === 500) {
          return rejectWithValue("Ошибка. Проверьте корректность кода или попробуйте позже")
        }
        return rejectWithValue((err.response.data as ErrorResponse)?.message ?? err.message)
      }
      return rejectWithValue((err as Error).message)
    }
  },
)

export const checkAuthStatus = createAsyncThunk<User | null>("auth/checkAuthStatus", async () => {
  try {
    const rt = localStorage.getItem("refreshToken")
    if (!rt) return null
    // await http.post("/auth/refresh", { refreshToken: rt })
    return await fetchProfile()
  } catch {
    return null
  }
})

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await http.delete("/auth/logout")
      localStorage.removeItem("refreshToken")
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return rejectWithValue("Токен не найден")
      }
      localStorage.removeItem("refreshToken")
    }
  },
)

export { clearAuthError }
