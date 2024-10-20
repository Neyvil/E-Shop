import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader.jsx";
import AdminMenu from "./AdminMenu.jsx";
import img from "../../image/img1.jpg";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter(
          (product) =>
            (selectedCategory === "all" ||
              product.category.name === selectedCategory) &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [products, selectedCategory, searchTerm]);

  const categories = products
    ? ["all", ...new Set(products.map((product) => product.category.name))]
    : ["all"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1e1f3b]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1e1f3b]">
        <p className="text-white text-xl">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1f3b]">
      <div className="lg:flex">
        <div className=" z-50 block  fixed overflow-y-auto">
          <AdminMenu />
        </div>

        <div className=" lg:ml-32 w-full">
          <div className="p-4 sm:p-8">
            <div className="lg:hidden mb-6">
              <AdminMenu />
            </div>

            <div className="flex flex-col items-center mb-10">
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-6 text-center">
                All Our{" "}
                <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
              <div className="w-full max-w-3xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 sm:p-4 pr-12 bg-[#292B4B] text-white border border-[#3d3f6a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff0066] transition-all duration-300"
                  />
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#ff0066] transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>
                {isFilterOpen && (
                  <div className="mt-4 p-4 bg-[#292B4B] rounded-lg shadow-lg  animate-fadeInUp">
                    <h3 className="text-white font-semibold mb-2">
                      Filter by Category:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedCategory === category
                              ? "bg-gradient-to-r from-[#a445b2] to-[#ff0066] text-white"
                              : "bg-[#3d3f6a] text-white hover:bg-[#4d4f7a]"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8  animate-fadeInUp">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-[#292B4B] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 sm:h-56 group">
                      <img
                        src={
                          product.productImage
                            ? `https://e-shop-backend-ep6p.onrender.com/${product.productImage.replace(
                                /\\/g,
                                "/"
                              )}`
                            : img
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-white text-lg font-bold hover:text-[#ff0066] transition-colors duration-300"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="text-lg font-bold text-white mb-2 truncate">
                        {product?.name}
                      </h5>
                      <p className="text-gray-400 text-xs sm:text-sm mb-2">
                        {moment(product.createAt).format("MMM Do YYYY")}
                      </p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {product?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Update
                        </Link>
                        <p className="text-white text-base sm:text-lg font-semibold">
                          ₹{product?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-lg text-center  animate-fadeInUp">
                No products found. Try a different category or search term.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
