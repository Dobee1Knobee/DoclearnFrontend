import { createSlice } from "@reduxjs/toolkit"
import { forgotPassword, validateResetToken, resetPassword } from "./thunks"

interface PasswordRecoveryState {
  isLoading: boolean
  error: string | null
  emailSent: boolean
  tokenValid: boolean
  passwordReset: boolean
  sentEmail: string | null
}

const initialState: PasswordRecoveryState = {
  isLoading: false,
  error: null,
  emailSent: false,
  tokenValid: false,
  passwordReset: false,
  sentEmail: null,
}

export const passwordRecoverySlice = createSlice({
  name: "passwordRecovery",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
    resetState(state) {
      return initialState
    },
    clearEmailSent(state) {
      state.emailSent = false
      state.sentEmail = null
    },
  },
  extraReducers: (builder) =>
    builder
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.emailSent = true
        state.sentEmail = payload.email
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as string
      })

      // validateResetToken
      .addCase(validateResetToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(validateResetToken.fulfilled, (state) => {
        state.isLoading = false
        state.tokenValid = true
      })
      .addCase(validateResetToken.rejected, (state, { payload }) => {
        state.isLoading = false
        state.tokenValid = false
        state.error = payload as string
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        state.passwordReset = true
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as string
      }),
})

export const { clearError, resetState, clearEmailSent } = passwordRecoverySlice.actions
export default passwordRecoverySlice.reducer
