import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UpdateProfileRequest, UpdateProfileResponse } from "../model/types"

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
