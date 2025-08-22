import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../../../shared/api/axiosBaseQuery"
import type {
  PendingUsersResponse,
  ApproveSpecificFieldsRequest,
  PendingDocumentsResponse,
  DocumentActionRequest,
} from "../model/types"

export const adminModerationApi = createApi({
  reducerPath: "adminModerationApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "https://api.doclearn.ru",
  }),
  tagTypes: ["PendingUsers", "PendingDocuments"],
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
        throw new Error("Изменения отклонены.")
      },
      invalidatesTags: ["PendingUsers"],
    }),

    getPendingDocuments: builder.query<PendingDocumentsResponse, void>({
      query: () => ({
        url: `/admin/documents/moderation`,
        method: "GET",
      }),
      providesTags: ["PendingDocuments"],
    }),

    approveDocument: builder.mutation<void, DocumentActionRequest>({
      query: ({ userId, documentId }) => ({
        url: `/admin/documents/approve`,
        method: "POST",
        data: { userId, documentId },
      }),
      invalidatesTags: ["PendingDocuments"],
    }),

    rejectDocument: builder.mutation<void, DocumentActionRequest>({
      query: ({ userId, documentId }) => ({
        url: `/admin/documents/reject`,
        method: "POST",
        data: { userId, documentId },
      }),
      invalidatesTags: ["PendingDocuments"],
    }),
  }),
})

export const {
  useGetPendingUsersQuery,
  useApproveAllChangesMutation,
  useApproveSpecificFieldsMutation,
  useRejectChangesMutation,
  useGetPendingDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
} = adminModerationApi
