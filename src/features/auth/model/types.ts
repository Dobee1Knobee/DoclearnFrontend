export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  email: string
  password: string
  birthday: string
  placeWork: string
  role: "student" | "doctor"
}

export interface VerifyDto {
  email: string
  code: string
}


