import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UpdateProfileRequest, UpdateProfileResponse } from "../model/types"

const baseQuery = fetchBaseQuery({ 
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
})

export const profileEditApi = createApi({
  reducerPath: "profileEditApi",
  baseQuery,
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

    followUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),

    unfollowUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    checkFollowStatus: builder.query<{ success: boolean; data: { isFollowing: boolean } }, string>({
      query: (userId) => ({
        url: `/user/${userId}/is-following`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
})

export const { useUpdateMyProfileMutation, useFollowUserMutation, useUnfollowUserMutation, useCheckFollowStatusQuery } = profileEditApi
