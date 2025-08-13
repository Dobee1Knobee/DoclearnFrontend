import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery"
import type { UpdateProfileRequest, UpdateProfileResponse, UploadAvatarResponse } from "../model/types"
import type { DocumentCategory } from "@/entities/user/model/types"
import { updateUserFields } from "@/features/auth/model/slice"

interface UploadDocumentRequest {
  document: File
  category: DocumentCategory
  label?: string
  isPublic: boolean
}

interface UploadDocumentResponse {
  message: string
}

export const profileEditApi = createApi({
  reducerPath: "profileEditApi",
  tagTypes: ["Profile", "UserProfile"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/update-my-profile",
        method: "POST",
        data,
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
            if (requestData.role !== undefined) {
              fieldsToUpdate.role = requestData.role
            }
            if (requestData.placeStudy !== undefined) {
              fieldsToUpdate.placeStudy = requestData.placeStudy
            }
            if (requestData.placeWork !== undefined) {
              fieldsToUpdate.placeWork = requestData.placeWork
            }
            if (requestData.education !== undefined) {
              fieldsToUpdate.education = requestData.education
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
          data: formData,
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

    uploadDocument: builder.mutation<UploadDocumentResponse, UploadDocumentRequest>({
      query: ({ document, category, label, isPublic }) => {
        const formData = new FormData()
        formData.append("document", document)
        formData.append("category", category)
        if (label) {
          formData.append("label", label)
        }
        formData.append("isPublic", isPublic.toString())
        return {
          url: "/user/upload-document-profile",
          method: "POST",
          data: formData,
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
      invalidatesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
        { type: "UserProfile", id: userId },
      ],
    }),

    unfollowUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
        { type: "UserProfile", id: userId },
      ],
    }),

    checkFollowStatus: builder.query<{ success: boolean; data: { isFollowing: boolean } }, string>({
      query: (userId) => ({
        url: `/user/${userId}/is-following`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
        { type: "UserProfile", id: userId },
      ],
    }),
  }),
})

export const {
  useUpdateMyProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
  useUploadAvatarMutation,
  useUploadDocumentMutation,
} = profileEditApi
