import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApisSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setGenderFilter,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio, genderFilter } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    priceFilter,
    genderFilter,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  }, [filteredProductsQuery.data, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    dispatch(setRadio(brand));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleGenderChange = (e) => {
    dispatch(setGenderFilter(e.target.value));
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id={`category-${category._id}`}
            onChange={(e) => handleCheck(e.target.checked, category._id)}
            checked={checked.includes(category._id)}
            className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={`category-${category._id}`}
            className="ml-2 text-sm font-medium text-white dark:text-gray-300"
          >
            {category.name}
          </label>
          {category.subcategories && category.subcategories.length > 0 && (
            <button
              onClick={() => toggleCategory(category._id)}
              className="ml-2 text-sm text-pink-500"
            >
              {expandedCategories[category._id] ? '▼' : '▶'}
            </button>
          )}
        </div>
        {category.subcategories && expandedCategories[category._id] && (
          <div className="ml-4">
            {renderCategories(category.subcategories, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const uniqueBrands = [
    ...new Set(products?.map((product) => product.brand).filter(Boolean)),
  ];

  // Check if any clothing category is selected
  const isClothingSelected = checked.some(id => 
    categories.find(cat => cat._id === id)?.name.toLowerCase() === 'clothing'
  );

  return (
    <div className="bg-[#1e1f3b] min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 lg:mb-16 text-center animate-fadeInUp">
          Explore Our <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">Latest Collection</span> 
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#ff0066] mb-6">Filter Your Search</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#ff0066] mb-3">Categories</h3>
              <div className=" overflow-y-auto custom-scrollbar pr-2">
                {renderCategories(categories)}
              </div>
            </div>
  
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#ff0066] mb-3">Brands</h3>
              <div className="max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {uniqueBrands.map((brand) => (
                  <div key={brand} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`brand-${brand}`}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      checked={radio === brand}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-500 focus:ring-pink-500"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-sm font-medium text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#ff0066] mb-3">Price Range</h3>
              <input
                type="number"
                placeholder="Max price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
  
            {isClothingSelected && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#ff0066] mb-3">Gender</h3>
                <select
                  value={genderFilter}
                  onChange={handleGenderChange}
                  className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            )}
  
            <button
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition duration-300"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
  
          <div className="lg:w-3/4">
            <h2 className="text-3xl font-bold text-[#ff0066] mb-6">
              {products?.length} Products Found
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Shop;