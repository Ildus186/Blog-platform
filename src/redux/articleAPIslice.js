import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { setCredentials, updateUser, setLoading } from "./authSlice"

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set("Authorization", `Token ${token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body: { user: body },
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: { user: credentials },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(
          setCredentials({
            user: data.user,
            token: data.user.token,
          })
        )
      },
    }),
    getCurrentUser: build.query({
      query: () => "/user",
      transformResponse: (response) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true))
        const { data } = await queryFulfilled
        dispatch(updateUser(data))
        dispatch(setLoading(false))
      },
    }),
    updateCurrentUser: build.mutation({
      query: (credentials) => ({
        url: "/user",
        method: "PUT",
        body: { user: credentials },
      }),
    }),
    getArticle: build.query({
      query: (offset) => `articles?limit=5&offset=${offset}`,
    }),
    getSingleArticle: build.query({
      query: (slug) => `/articles/${slug}`,
    }),
    createArticle: build.mutation({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body: { article: body },
      }),
    }),
    updateArticle: build.mutation({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article },
      }),
    }),
    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: "DELETE",
      }),
    }),
    toggleLike: build.mutation({
      query: ({ id, like }) => ({
        url: `/articles/${id}/favorite`,
        method: like ? "POST" : "DELETE",
      }),
    }),
  }),
})

export const {
  useGetArticleQuery,
  useGetSingleArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useToggleLikeMutation,
  useRegisterMutation,
  useLoginMutation,
} = articleApi
