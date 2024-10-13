import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/all`,
    }),

    getProductDetail: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    removeProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "Delete",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
  query: ({ checked, radio, priceFilter, genderFilter }) => ({
    url: `${PRODUCT_URL}/filtered-products`,
    method: "POST",
    body: { 
      categories: checked, 
      brand: radio, 
      priceFilter, 
      gender: genderFilter 
    },
  }),
}),
  }),
});

export const {
  useAllProductsQuery,
  useGetProductDetailQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useRemoveProductMutation,
  useGetProductsQuery,
  useCreateReviewMutation,
  useGetNewProductsQuery,
  useGetTopProductsQuery,
  useGetFilteredProductsQuery,
} = productApiSlice;
