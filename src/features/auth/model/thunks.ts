import { createAsyncThunk } from '@reduxjs/toolkit'
import http from '@/shared/api/http'
import type { User } from '@/entities/user/model/types'
import type { LoginDto, RegisterDto, VerifyDto } from './types'
import { clearAuthError, setRegistrationEmail } from './slice'

async function fetchProfile(): Promise<User> {
  const { data } = await http.get<{ success: boolean; data: User }>('/user/me');
  return data.data;
}

export const loginUser = createAsyncThunk<User, LoginDto>(
  'auth/loginUser',
  async (dto, { rejectWithValue }) => {
    try {
      await http.post('/auth/login', dto);
      return await fetchProfile();
    } catch (e: any) {
      return rejectWithValue(e);
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
      dispatch(setRegistrationEmail(dto.email));
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const verifyUserEmail = createAsyncThunk<User, VerifyDto>(
  'auth/verifyUserEmail',
  async (dto, { rejectWithValue }) => {
    try {
      await http.post('/auth/verify-email', dto);
      return await fetchProfile();
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const checkAuthStatus = createAsyncThunk<User | null>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProfile();
    } catch {
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
});
export { clearAuthError };

