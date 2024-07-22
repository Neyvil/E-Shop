import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { current } from "@reduxjs/toolkit";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    currentProfileDetails: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["UserProfile"],
      keepUnusedDataFor: 300,
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({ url: `${USERS_URL}/${userId}`, method: "DELETE" }),
    }),

    getUserDetailById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    udateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useUploadMutation,
  useCurrentProfileDetailsQuery,
  useDeleteUserMutation,
  useGetUserDetailByIdQuery,
  useGetUsersQuery,
  useUdateUserMutation,
} = userApiSlice;