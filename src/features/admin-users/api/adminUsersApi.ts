import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery"
import type { AdminUsersResponse, GetAdminUsersParams } from "../model/types"

export const adminUsersApi = createApi({
  reducerPath: "adminUsersApi",
  baseQuery: axiosBaseQuery({ baseUrl: "https://api.doclearn.ru" }),
  tagTypes: ["AdminUsers"],
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUsersResponse, GetAdminUsersParams>({
      query: ({ page = 1 }) => ({
        url: `/admin/users`,
        method: "GET",
        params: { page },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }),
      providesTags: ["AdminUsers"],
    }),
    banUser: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/admin/users/${userId}/ban`,
        method: "POST",
        data: { reason },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    unbanUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}/unban`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
})

export const { useGetAdminUsersQuery, useBanUserMutation, useUnbanUserMutation } = adminUsersApi
