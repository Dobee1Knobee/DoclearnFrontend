import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../../../shared/api/axiosBaseQuery"
import type { PendingUsersResponse, ApproveSpecificFieldsRequest } from "../model/types"

export const adminModerationApi = createApi({
  reducerPath: "adminModerationApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "https://api.doclearn.ru",
  }),
  tagTypes: ["PendingUsers"],
  endpoints: (builder) => ({
    getPendingUsers: builder.query<PendingUsersResponse, { page: number }>({
      query: ({ page }) => ({
        url: `/admin/users/pending`,
        method: "GET",
        params: { page },
      }),
      providesTags: ["PendingUsers"],
    }),

    approveAllChanges: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/approve-changes`,
        method: "POST",
      }),
      invalidatesTags: ["PendingUsers"],
    }),

    approveSpecificFields: builder.mutation<void, { userId: string; fields: ApproveSpecificFieldsRequest }>({
      query: ({ userId, fields }) => ({
        url: `/admin/users/${userId}/approveSpecificFields`,
        method: "POST",
        data: fields,
      }),
      invalidatesTags: ["PendingUsers"],
    }),

    rejectChanges: builder.mutation<void, string>({
      query: (userId) => {
        throw new Error("Reject functionality not yet implemented")
      },
      invalidatesTags: ["PendingUsers"],
    }),
  }),
})

export const {
  useGetPendingUsersQuery,
  useApproveAllChangesMutation,
  useApproveSpecificFieldsMutation,
  useRejectChangesMutation,
} = adminModerationApi
