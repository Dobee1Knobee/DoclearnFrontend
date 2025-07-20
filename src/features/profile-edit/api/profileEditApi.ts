import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UpdateProfileRequest, UpdateProfileResponse, UploadAvatarResponse } from "../model/types"
import { updateUserFields } from "@/features/auth/model/slice"

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
  tagTypes: ["Profile", "UserProfile"],
  baseQuery,
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/update-my-profile",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (requestData, { dispatch, queryFulfilled }) => {
        try {
          const { data: responseData } = await queryFulfilled

          if (responseData.success) {
            const fieldsToUpdate: any = {}

            if (requestData.defaultAvatarPath !== undefined) {
              fieldsToUpdate.defaultAvatarPath = requestData.defaultAvatarPath
            }
            if (requestData.location !== undefined) {
              fieldsToUpdate.location = requestData.location
            }
            if (requestData.birthday !== undefined) {
              fieldsToUpdate.birthday = requestData.birthday
            }
            if (requestData.bio !== undefined) {
              fieldsToUpdate.bio = requestData.bio
            }
            if (requestData.contacts !== undefined) {
              fieldsToUpdate.contacts = requestData.contacts
            }
            if (requestData.experience !== undefined) {
              fieldsToUpdate.experience = requestData.experience
            }
            if (requestData.programType !== undefined) {
              fieldsToUpdate.programType = requestData.programType
            }

            if (Object.keys(fieldsToUpdate).length > 0) {
              dispatch(updateUserFields(fieldsToUpdate))
            }
          }
        } catch (error) {
          console.error("Failed to update profile:", error)
        }
      },
      invalidatesTags: (result, error, arg) => {
        if (error) return []

        return [
          { type: "Profile" as const, id: "LIST" },
          { type: "Profile" as const, id: "ME" },
          { type: "Profile" as const, id: "CURRENT" },
          { type: "UserProfile" as const, id: "LIST" },
          { type: "UserProfile" as const, id: "ME" },
          { type: "UserProfile" as const, id: "CURRENT" },
          { type: "Profile", id: "ME" },
          { type: "Profile", id: "LIST" },
          "Profile",
          "UserProfile",
        ] 
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
      invalidatesTags: (result, error, arg) => {
        if (error) return []

        return [
          { type: "Profile" as const, id: "LIST" },
          { type: "Profile" as const, id: "ME" },
          { type: "Profile" as const, id: "CURRENT" },
          { type: "UserProfile" as const, id: "LIST" },
          { type: "UserProfile" as const, id: "ME" },
          { type: "UserProfile" as const, id: "CURRENT" },
          { type: "Profile", id: "ME" },
          { type: "Profile", id: "LIST" },
          "Profile",
          "UserProfile",
        ]
      },
    }),

    followUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }, { type: "UserProfile", id: userId }],
    }),

    unfollowUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }, { type: "UserProfile", id: userId },],
    }),

    checkFollowStatus: builder.query<{ success: boolean; data: { isFollowing: boolean } }, string>({
      query: (userId) => ({
        url: `/user/${userId}/is-following`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }, { type: "UserProfile", id: userId },],
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
