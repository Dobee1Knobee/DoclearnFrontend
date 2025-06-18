export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
}

export interface ValidateTokenDto {
  token: string
}

export interface PasswordRecoveryState {
  isLoading: boolean
  error: string | null
  emailSent: boolean
  tokenValid: boolean
  passwordReset: boolean
  sentEmail: string | null
}
