import { createSlice } from '@reduxjs/toolkit';

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    categories: [],
    products: [],
    checked: [],
    radio: '',
    priceFilter: '',
    genderFilter: '',
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
    setGenderFilter: (state, action) => {
      state.genderFilter = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setPriceFilter,
  setGenderFilter,
} = shopSlice.actions;

export default shopSlice.reducer;
