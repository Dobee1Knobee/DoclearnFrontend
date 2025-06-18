import { createAsyncThunk } from '@reduxjs/toolkit'
import http from '@/shared/api/http'
import type { User } from '@/entities/user/model/types'
import type { LoginDto, RegisterDto, VerifyDto } from './types'
import { clearAuthError, setRegistrationEmail } from './slice'

async function fetchProfile(): Promise<User> {
  const { data } = await http.get<{ success: boolean; data: User }>('/user/me');
  return data.data
}

export const loginUser = createAsyncThunk<User, LoginDto>(
  'auth/loginUser',
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<{ refreshToken: string }>('/auth/login', dto);
      localStorage.setItem('refreshToken', response.data.refreshToken)
      return await fetchProfile()
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message)
    }
  }
);

export const registerUser = createAsyncThunk<void, RegisterDto>(
  'auth/registerUser',
  async (dto, { dispatch, rejectWithValue }) => {
    try {
      await http.post('/auth/register', {
        ...dto,
        birthday: dto.birthday + 'T00:00:00.000Z',
      });
      dispatch(setRegistrationEmail(dto.email))
    } catch (e: any) {
      return rejectWithValue(e)
    }
  }
);

export const verifyUserEmail = createAsyncThunk<User, VerifyDto>(
  'auth/verifyUserEmail',
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<{ refreshToken: string }>('/auth/verify-email', dto);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return await fetchProfile();
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  },
)

export const checkAuthStatus = createAsyncThunk<User | null>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
    const rt = localStorage.getItem("refreshToken")

    if (!rt) {
      return null
    }

    await http.post("/auth/refresh", { refreshToken: rt })

    const user = await fetchProfile()
    return user
  } catch (error) {
    return null
  }
})

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("refreshToken")
})

export { clearAuthError }



