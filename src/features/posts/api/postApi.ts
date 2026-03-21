import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery"
import type {
  PostFeedResponse,
  PostSingleResponse,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  Post,
} from "@/entities/post/model/types"

interface PaginationParams {
  page?: number
  limit?: number
}

interface UserPostsParams extends PaginationParams {
  userId: string
}

interface SearchPostsParams {
  specialty?: string
  isCase?: boolean
  difficulty?: string
  tags?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  skip?: number
}

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Post", "Feed", "UserPosts", "MyPosts"],
  endpoints: (builder) => ({
    // Лента
    getFeed: builder.query<PostFeedResponse, PaginationParams | void>({
      query: (params) => ({
        url: "/post/feed",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((post) => ({ type: "Post" as const, id: post.id })),
              { type: "Feed", id: "LIST" },
            ]
          : [{ type: "Feed", id: "LIST" }],
    }),

    // Пост по ID
    getPost: builder.query<PostSingleResponse, string>({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Посты пользователя
    getUserPosts: builder.query<PostFeedResponse, UserPostsParams>({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: `/post/user/${userId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, { userId }) => [{ type: "UserPosts", id: userId }],
    }),

    // Мои посты
    getMyPosts: builder.query<PostFeedResponse, PaginationParams | void>({
      query: (params) => ({
        url: "/post/my/posts",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      providesTags: [{ type: "MyPosts", id: "LIST" }],
    }),

    // Создание
    createPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: (data) => ({
        url: "/post/",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Feed", id: "LIST" },
        { type: "MyPosts", id: "LIST" },
      ],
    }),

    // Обновление
    updatePost: builder.mutation<PostSingleResponse, { id: string; data: UpdatePostRequest }>({
      query: ({ id, data }) => ({
        url: `/post/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Post", id },
        { type: "Feed", id: "LIST" },
        { type: "MyPosts", id: "LIST" },
      ],
    }),

    // Удаление
    deletePost: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Post", id },
        { type: "Feed", id: "LIST" },
        { type: "MyPosts", id: "LIST" },
      ],
    }),

    // Лайк
    likePost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/post/${id}/like`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getFeed", undefined, (draft) => {
            const post = draft.data.find((p) => p.id === id)
            if (post) {
              post.stats.likes += 1
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Анлайк
    unlikePost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/post/${id}/like`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getFeed", undefined, (draft) => {
            const post = draft.data.find((p) => p.id === id)
            if (post) {
              post.stats.likes = Math.max(0, post.stats.likes - 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Поиск
    searchPosts: builder.query<PostFeedResponse, SearchPostsParams>({
      query: (params) => ({
        url: "/post/search",
        method: "GET",
        params,
      }),
    }),

    // Клинические случаи
    getClinicalCases: builder.query<PostFeedResponse, PaginationParams | void>({
      query: (params) => ({
        url: "/post/cases/clinical",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
    }),

    // Посты по специальности
    getPostsBySpecialty: builder.query<PostFeedResponse, { specialty: string } & PaginationParams>({
      query: ({ specialty, page = 1, limit = 20 }) => ({
        url: `/post/specialty/${specialty}`,
        method: "GET",
        params: { page, limit },
      }),
    }),
  }),
})

export const {
  useGetFeedQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useGetMyPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useSearchPostsQuery,
  useGetClinicalCasesQuery,
  useGetPostsBySpecialtyQuery,
} = postApi
