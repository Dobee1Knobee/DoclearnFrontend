import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { SpecialistUser } from "@/entities/user/model/types"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.doclearn.ru",
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

export const authorProfileApi = createApi({
  reducerPath: "authorProfileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getAuthorProfile: builder.query<SpecialistUser, string>({
      query: (id: string) => `/user/${id}/profile`,
      transformResponse: (response: any): SpecialistUser => {

        const userData = response.data || response
        const transformedProfile: SpecialistUser = {
          ...userData,
          publications: [],
        }
        return transformedProfile
      },
      transformErrorResponse: (response: any) => {
        if (response.status === 404) {
          return {
            status: 404,
            data: { message: "Такого пользователя не существует" },
          }
        }
        return response
      },
      providesTags: (result, error, id) => [
        { type: "Profile", id },
        { type: "Profile", id: "LIST" },
      ],
    }),

    getMyProfile: builder.query<SpecialistUser, void>({
      query: () => `/user/me`,
      transformResponse: (response: any): SpecialistUser => {
        const userData = response.data || response
        const transformedProfile: SpecialistUser = {
          ...userData,
          publications: [],
        }
        return transformedProfile
      },
      providesTags: [
        { type: "Profile", id: "ME" },
        { type: "Profile", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetAuthorProfileQuery, useGetMyProfileQuery } = authorProfileApi
