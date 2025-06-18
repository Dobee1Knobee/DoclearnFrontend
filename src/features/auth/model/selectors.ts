import type { RootState } from '@/app/store'

export const selectAuthState = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user
export const selectLoading = (state: RootState) => state.auth.isLoading
export const selectError = (state: RootState) => state.auth.error
export const selectRegistrationEmail = (state: RootState) => state.auth.registrationEmail
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized
