import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery"
import type { SpecialistUser } from "@/entities/user/model/types"

export const authorProfileApi = createApi({
  reducerPath: "authorProfileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getAuthorProfile: builder.query<SpecialistUser, string>({
      query: (id: string) => ({
        url: `/user/${id}/profile`,
        method: "GET",
      }),
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
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
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
