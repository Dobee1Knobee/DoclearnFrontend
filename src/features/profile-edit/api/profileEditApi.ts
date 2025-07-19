import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UpdateProfileRequest, UpdateProfileResponse, UploadAvatarResponse } from "../model/types"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.doclearn.ru",

  prepareHeaders: (headers, { endpoint }) => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
      headers.set("Authorization", `Bearer ${refreshToken}`)
    }

    if (endpoint !== "uploadAvatar") {
      headers.set("Content-Type", "application/json")
    }

    return headers
  },
  credentials: "include",
})

export const profileEditApi = createApi({
  reducerPath: "profileEditApi",
  tagTypes: ["Profile"],
  baseQuery,
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/update-my-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, _error, _arg) => {
        const tags = [
          { type: "Profile" as const, id: "LIST" },
          { type: "Profile" as const, id: "ME" },
        ] 
        if (result?.data?._id) {
          tags.push({ type: "Profile", id: result.data._id })
        }
        return tags
      },
    }),

    uploadAvatar: builder.mutation<UploadAvatarResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append("avatar", file)
        return {
          url: "/user/avatar",
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: (result, _error, _arg) => {
        const tags = [
          { type: "Profile" as const, id: "LIST" },
          { type: "Profile" as const, id: "ME" },
        ]
        return tags
      },
    }),

    followUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }],
    }),

    unfollowUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }],
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

export const {
  useUpdateMyProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
  useUploadAvatarMutation,
} = profileEditApi
