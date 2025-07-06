import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AuthorProfile } from "@/entities/user/model/types"

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

export const authorProfileApi = createApi({
  reducerPath: "authorProfileApi",
  baseQuery,
  tagTypes: ["AuthorProfile"],
  endpoints: (builder) => ({
    getAuthorProfile: builder.query<AuthorProfile, string>({
      query: (id: string) => `/user/${id}/profile`,
      transformResponse: (response: any): AuthorProfile => {

        const userData = response.data || response
        const transformedProfile: AuthorProfile = {
          ...userData,
          courses: [],
          publications: [],
          // education: [
          //   {
          //     id: "e1",
          //     institution: "СГМУ",
          //     degree: "Бакалавр",
          //     specialty: "Хирург",
          //     startDate: "2010-10-05",
          //     graduationYear: "2014",
          //     isCurrently: false
          //   },
          //   {
          //     id: "e2",
          //     institution: "Рудн",
          //     degree: "Ординатура",
          //     specialty: "Хирург",
          //     startDate: "2014-10-05",
          //     graduationYear: "2018",
          //     isCurrently: false
          //   },
          //   {
          //     id: "e1",
          //     institution: "СГМУ",
          //     degree: "Бакалавр",
          //     specialty: "Хирург",
          //     startDate: "2018-10-05",
          //     graduationYear: "2026",
          //     isCurrently: true
          //   },
          // ],
          // achievements: userData.achievements || [
          //   {
          //     id: "a1",
          //     title: "Лучший преподаватель",
          //     description: "Приз за вклад в образование",
          //     earnedDate: "2021-06-01",
          //     category: "education",
          //   },
          //   {
          //     id: "a2",
          //     title: "Врач года",
          //     description: "Приз за вклад в медицину",
          //     earnedDate: "2022-06-01",
          //     category: "other",
          //   },
          //   {
          //     id: "a3",
          //     title: "ELO 2847",
          //     description: "Высокий рейтинг",
          //     earnedDate: "2025-06-01",
          //     category: "rating",
          //   },
          //   {
          //     id: "a4",
          //     title: "Публикации 20+",
          //     description: "Множество публикаций",
          //     earnedDate: "2023-06-01",
          //     category: "publication",
          //   },
          //   {
          //     id: "a5",
          //     title: "Патенты",
          //     description: "Научные патенты",
          //     earnedDate: "2020-06-01",
          //     category: "other",
          //   },
          // ],
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
        { type: "AuthorProfile", id },
        { type: "AuthorProfile", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetAuthorProfileQuery } = authorProfileApi
