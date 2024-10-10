import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import favouritesReducer from "../redux/features/favourites/favouriteSlice.js";
import cartSliceReducer from "../redux/features/cart/cartSlice.js";
import shopReducer from "../redux/features/shop/shopSlice.js"
import { getFavouritesFromLocalStorage } from "../Utils/localStorage";

const initialFavourites = getFavouritesFromLocalStorage() | [];

const store = configureStore({
  reducer: {
    // Add the API slice reducer to the store
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favourites: favouritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favourites: initialFavourites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add API slice middleware
  devTools: true,
});
// Set up listeners to refetch data based on certain events
setupListeners(store.dispatch);

export default store;
