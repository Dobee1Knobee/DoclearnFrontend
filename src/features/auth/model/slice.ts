import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loginUser, registerUser, verifyUserEmail, checkAuthStatus, logoutUser } from './thunks'
import type { User } from '@/entities/user/model/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationEmail: string | null
  isInitialized : boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationEmail: null,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) { state.error = null },
    setRegistrationEmail(state, action: PayloadAction<string>) {
      state.registrationEmail = action.payload
    },
  },
  extraReducers: (b) =>
    b
      // loginUser
      .addCase(loginUser.pending,   (s) => { 
        s.isLoading = true  
        s.error = null 
      })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.isLoading = false
        s.user = payload
        s.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.isLoading = false
        s.error = payload as string
      })

      // registerUser
      .addCase(registerUser.pending,   (s) => { 
        s.isLoading = true  
        s.error = null 
      })
      .addCase(registerUser.fulfilled, (s) => { 
        s.isLoading = false 
      })
      .addCase(registerUser.rejected,  (s, { payload }) => {
        s.isLoading = false
        s.error = payload as string
      })

      // verifyUserEmail
      .addCase(verifyUserEmail.pending,   s => { s.isLoading = true;  s.error = null })
      .addCase(verifyUserEmail.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.user = payload;
        s.isAuthenticated = true;
        s.registrationEmail = null;
      })
      .addCase(verifyUserEmail.rejected,  (s, { payload }) => {
        s.isLoading = false;
        s.error = payload as string;
      })

      // checkAuthStatus
      .addCase(checkAuthStatus.pending,   (s) => { 
        s.isLoading = true 
      })
      .addCase(checkAuthStatus.fulfilled, (s, { payload }) => {
        s.isLoading = false
        s.user = payload
        s.isAuthenticated = Boolean(payload)
        s.isInitialized = true
      })
      .addCase(checkAuthStatus.rejected,  (s) => { 
        s.isLoading = false 
        s.isInitialized = true
        s.user = null
        s.isAuthenticated = false
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null
        s.isAuthenticated = false
      }),
})

export const { clearAuthError, setRegistrationEmail } = authSlice.actions
export default authSlice.reducer
