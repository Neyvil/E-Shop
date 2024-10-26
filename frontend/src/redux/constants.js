// constants.js
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://e-shopbackend-bnov.onrender.com"
    : ["http://localhost:3000"]; // In development, use proxy in Vite

export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;
