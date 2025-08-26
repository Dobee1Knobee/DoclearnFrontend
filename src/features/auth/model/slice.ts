import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { loginUser, registerUser, verifyUserEmail, checkAuthStatus, logoutUser } from "./thunks"
import type { SpecialistUser, Document, DoctorUser } from "@/entities/user/model/types"
import type { UpdateSpecialistFieldsPayload } from "./types"
import { specializations } from "@/shared/data/specializations"

interface AuthState {
  user: SpecialistUser | null
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
    updateUserFields(state, action: PayloadAction<UpdateSpecialistFieldsPayload>) {
      if (state.user) {
        const {
          defaultAvatarPath,
          location,
          birthday,
          bio,
          contacts,
          experience,
          stats,
          placeStudy,
          placeWork,
          role,
          education,
          specializations,
        } = action.payload

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
        if (experience !== undefined) {
          state.user.experience = experience
        }
        if (placeStudy !== undefined) {
          state.user.placeStudy = placeStudy
        }
        if (placeWork !== undefined) {
          state.user.placeWork = placeWork
        }
        if (role !== undefined && role !== state.user.role) {
          state.user.role = role
        }
        if (education !== undefined) {
          (state.user as SpecialistUser).education = education as any
        }
        if (specializations !== undefined) {
          (state.user as DoctorUser).specializations = specializations as any
        }
      }
    },
    addDocument(state, action: PayloadAction<Document>) {
      if (state.user) {
        if (!state.user.documents) {
          state.user.documents = []
        }
        state.user.documents.push(action.payload)
      }
    },
    removeDocument(state, action: PayloadAction<string>) {
      if (state.user && state.user.documents) {
        state.user.documents = state.user.documents.filter((doc) => doc._id !== action.payload)
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

export const {
  clearAuthError,
  setRegistrationEmail,
  clearRegistrationEmail,
  updateUserFields,
  addDocument,
  removeDocument,
} = authSlice.actions
export default authSlice.reducer
