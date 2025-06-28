import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AuthorProfile } from "@/entities/user/model/types"

interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  birthday?: string
  bio?: string
  placeWork?: string
  location?: string
  experience?: string
  specialization?: string
  contacts?: Array<{
    type: string
    value: string
    label?: string
    isPublic?: boolean
  }>
  education?: Array<{
    id?: string,
    institution: string
    degree?: string
    startDate: string
    specialty?: string
    graduationYear?: string
    isCurrently?: boolean
  }>
  avatar?: string
}

interface UpdateProfileResponse {
  success: boolean
  data: AuthorProfile
  moderationFields?: string[]
}
console.log()
export const profileEditApi = createApi({
  reducerPath: "profileEditApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dl-back-756832582185.us-east1.run.app",
    prepareHeaders: (headers) => {
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        headers.set("Authorization", `Bearer ${refreshToken}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
    credentials: "include", 
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/update-my-profile", 
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
})

export const { useUpdateMyProfileMutation } = profileEditApi
