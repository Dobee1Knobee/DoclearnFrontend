export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  password: string
  birthday: string
  placeWork: string
  role: "student" | "doctor"
  defaultAvatarPath: string
}

export interface VerifyDto {
  email: string
  code: string
}


