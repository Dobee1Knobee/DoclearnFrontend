import type { RootState } from "@/app/store"

export const selectPasswordRecoveryState = (state: RootState) => state.passwordRecovery
export const selectIsLoading = (state: RootState) => state.passwordRecovery.isLoading
export const selectError = (state: RootState) => state.passwordRecovery.error
export const selectEmailSent = (state: RootState) => state.passwordRecovery.emailSent
export const selectTokenValid = (state: RootState) => state.passwordRecovery.tokenValid
export const selectPasswordReset = (state: RootState) => state.passwordRecovery.passwordReset
export const selectSentEmail = (state: RootState) => state.passwordRecovery.sentEmail
