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
  }),
})

export const { useGetAdminUsersQuery } = adminUsersApi
