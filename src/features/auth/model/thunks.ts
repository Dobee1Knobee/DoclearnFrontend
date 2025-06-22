import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import http from '@/shared/api/http'
import type { User } from '@/entities/user/model/types'
import type { LoginDto, RegisterDto, VerifyDto } from './types'
import { clearAuthError, setRegistrationEmail } from './slice'

async function fetchProfile(): Promise<User> {
  const { data } = await http.get<{ success: boolean; data: User }>('/user/me');
  return data.data;
}

export const loginUser = createAsyncThunk<
  User,
  LoginDto,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<{ refreshToken: string }>('/auth/login', dto);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return await fetchProfile();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          return rejectWithValue('Неверный логин или пароль');
        }
        return rejectWithValue((err.response.data as any)?.message ?? err.message);
      }
      return rejectWithValue((err as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk<void, RegisterDto, { rejectValue: string }>(
  'auth/registerUser',
  async (dto, { dispatch, rejectWithValue }) => {
    try {
      await http.post('/auth/register', {
        ...dto,
        birthday: dto.birthday + 'T00:00:00.000Z',
      });
      dispatch(setRegistrationEmail(dto.email));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        return rejectWithValue('Пользователь с такой почтой уже существует');
      }
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message ?? err.message);
      }
      return rejectWithValue((err as Error).message);
    }
  }
);

export const verifyUserEmail = createAsyncThunk<
  User,
  VerifyDto,
  { rejectValue: string }
>(
  'auth/verifyUserEmail',
  async (dto, { rejectWithValue }) => {
    try {
      const response = await http.post<{ refreshToken: string }>('/auth/verify-email', dto);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return await fetchProfile();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          return rejectWithValue('Неверный код подтверждения');
        }
        if (err.response.status === 500) {
          return rejectWithValue('Ошибка. Проверьте корректность кода или попробуйте позже');
        }
        return rejectWithValue((err.response.data as any)?.message ?? err.message);
      }
      return rejectWithValue((err as Error).message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk<User | null>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const rt = localStorage.getItem('refreshToken');
      if (!rt) return null;
      await http.post('/auth/refresh', { refreshToken: rt });
      return await fetchProfile();
    } catch {
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('refreshToken');
});

export { clearAuthError };
