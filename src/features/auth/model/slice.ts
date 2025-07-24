import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { loginUser, registerUser, verifyUserEmail, checkAuthStatus, logoutUser } from "./thunks"
import type { User} from "@/entities/user/model/types"
import type { UpdateUserFieldsPayload } from "./types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationEmail: string | null
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationEmail: null,
  isInitialized: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null 
    },
    setRegistrationEmail(state, action: PayloadAction<string>) {
      state.registrationEmail = action.payload
    },
    clearRegistrationEmail(state) {
      state.registrationEmail = null
    },
    updateUserFields(state, action: PayloadAction<UpdateUserFieldsPayload>) {
      if (state.user) {
        const { defaultAvatarPath, location, birthday, bio, contacts, experience, programType, stats } = action.payload

        if (defaultAvatarPath !== undefined) {
          state.user.defaultAvatarPath = defaultAvatarPath
        }
        if (location !== undefined) {
          state.user.location = location
        }
        if (birthday !== undefined) {
          state.user.birthday = birthday
        }
        if (bio !== undefined) {
          state.user.bio = bio
        }
        if (contacts !== undefined) {
          state.user.contacts = contacts
        }
        if (stats !== undefined) {
          state.user.stats = {
            ...state.user.stats,
            ...stats,
          }
        }
        if (experience !== undefined && state.user.role === "doctor" || state.user.role === "admin") {
          ;(state.user as any).experience = experience
        }
        if (programType !== undefined && state.user.role === "student" || state.user.role === "admin") {
          ;(state.user as any).programType = programType
        }
      }
    },
  },
  extraReducers: (b) =>
    b
      // loginUser
      .addCase(loginUser.pending, (s) => { 
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
      .addCase(registerUser.pending, (s) => { 
        s.isLoading = true  
        s.error = null 
      })
      .addCase(registerUser.fulfilled, (s) => { 
        s.isLoading = false 
      })
      .addCase(registerUser.rejected, (s, { payload }) => {
        s.isLoading = false
        s.error = payload as string
      })

      // verifyUserEmail
      .addCase(verifyUserEmail.pending, (s) => { 
        s.isLoading = true  
        s.error = null 
      })
      .addCase(verifyUserEmail.fulfilled, (s, { payload }) => {
        s.isLoading = false
        s.user = payload
        s.isAuthenticated = true
        s.registrationEmail = null
      })
      .addCase(verifyUserEmail.rejected, (s, { payload }) => {
        s.isLoading = false
        s.error = payload as string
      })

      // checkAuthStatus
      .addCase(checkAuthStatus.pending, (s) => { 
        s.isLoading = true 
      })
      .addCase(checkAuthStatus.fulfilled, (s, { payload }) => {
        s.isLoading = false
        s.user = payload
        s.isAuthenticated = Boolean(payload)
        s.isInitialized = true
      })
      .addCase(checkAuthStatus.rejected, (s) => { 
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

export const { clearAuthError, setRegistrationEmail, clearRegistrationEmail, updateUserFields } = authSlice.actions
export default authSlice.reducer
