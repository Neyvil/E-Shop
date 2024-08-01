import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

import React from "react";

export const categoryApisSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
    }),

    fetchCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/categories`,
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 300,
    }),
    // remember that in query the argument u pass that argument in star mark place in category list.jsx
    updateCategory: builder.mutation({
      query: ({ categoryId, updateCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updateCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({categoryId}) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApisSlice;
