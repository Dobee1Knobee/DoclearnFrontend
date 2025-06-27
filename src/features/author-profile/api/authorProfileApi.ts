import { createApi } from '@reduxjs/toolkit/query/react'
import type { AuthorProfile } from '@/entities/user/model/types'
import http from '@/shared/api/http'
import mockProfile from '@/shared/api/mocks/author-profile.json'

/**
 * customBaseQuery позволяет:
 * - сразу отдавать mockProfile для любых запросов вида `/profile/{id}`
 * - во всех остальных случаях проксировать запросы через ваш http-клиент
 */
const customBaseQuery = async ({
  url,
  method = 'GET',
  data,
}: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
}) => {
  // Если запрос за профилем — возвращаем мок
  if (url.startsWith('/profile/')) {
    return { data: mockProfile as AuthorProfile }
  }

  try {
    const result = await http.request({ url, method, data })
    return { data: result.data }
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data ?? error.message,
      },
    }
  }
}

export const authorProfileApi = createApi({
  reducerPath: 'authorProfileApi',
  baseQuery: customBaseQuery,
  tagTypes: ['AuthorProfile'],
  endpoints: (builder) => ({
    getAuthorProfile: builder.query<AuthorProfile, string>({
      query: (id: string) => ({ url: `/profile/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'AuthorProfile', id }],
    }),
    // В будущем можно добавить updateAuthorProfile, deleteAuthorProfile и т.п.
  }),
})

export const { useGetAuthorProfileQuery } = authorProfileApi



