import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice.js";
import Loader from "../../components/Loader.jsx";
import AdminMenu from "./AdminMenu.jsx";
import img from "../../image/img1.jpg";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  console.log(products)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-xl">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col pt-10 items-center p-4 sm:p-8 md:ml-16 bg-[#292B4B] overflow-y-auto">
      <div className="relative mb-10 z-50">
        <AdminMenu />
      </div>
      <h1 className="font-serif font-bold text-3xl lg:text-4xl text-white mb-8">
        All <span className="text-[#7303c0]">Products</span>
      </h1>
      {products && products.length > 0 ? (
        [
          ...new Map(
            products.map((product) => [product.category._id, product.category])
          ).values(),
        ].map((category) => (
          <div key={category._id} className="mb-8">
            <div className="w-full flex flex-col items-center mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-semibold text-white text-center">
                {category.name}
              </h2>
            </div>

            <div className="w-[50%] sm:w-full my-5">
              <svg
                version="1.1"
                id="line_2"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="1200px"
                height="5px"
                xmlSpace="preserve"
              >
                <path
                  className="path2"
                  fill="none"
                  strokeWidth="3"
                  stroke="#7303c0"
                  d="M0 0 l1120 0"
                />
              </svg>

              <style jsx>{`
                .path2 {
                  stroke-dasharray: 1120;
                  animation: draw1 1s linear alternate;
                }

                @keyframes draw1 {
                  from {
                    stroke-dashoffset: 1120;
                  }
                  to {
                    stroke-dashoffset: 2240;
                  }
                }
              `}</style>
            </div>

            <div className="grid grid-cols-1 gap-8 justify-items-center lg:grid-cols-2 xl:grid-cols-3">
              {products.filter(
                (product) => product.category._id === category._id
              ).length > 0 ? (
                products
                  .filter((product) => product.category._id === category._id)
                  .map((filteredProduct) => (
                    <div
                      key={filteredProduct._id}
                      className="block w-full min-h-[400px] max-w-xs bg-[#1e1f3b] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                        <img
                          src={
                            filteredProduct.productImage
                              ? `http://localhost:5000/${filteredProduct.productImage.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : img
                          }
                          alt={filteredProduct.name}
                          className="w-full h-full object-cover"
                        />
                        <Link
                          to={`/product/${filteredProduct._id}`} // Link to product detail page
                          className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-center items-center"
                        >
                          <p className="text-white text-lg font-bold hover:text-[#7303c0]">
                            View Product
                          </p>
                        </Link>
                      </div>
                      <div className="mt-4 flex flex-col justify-between">
                        <h5 className="text-lg font-bold text-white mb-2">
                          {filteredProduct?.name}
                        </h5>
                        <p className="text-gray-400 text-sm">
                          {moment(filteredProduct.createAt).format(
                            "MMM Do YYYY"
                          )}
                        </p>
                        <p className="text-gray-300 text-sm mt-2">
                          {filteredProduct?.description?.substring(0, 100)}...
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <Link
                            to={`/admin/product/update/${filteredProduct._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-700 to-purple-600 rounded-lg hover:bg-gradient-to-l hover:shadow-lg transition-all duration-300"
                          >
                            Update Product
                            <svg
                              className="w-4 h-4 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </Link>
                          <p className="text-white text-lg font-semibold">
                            ${filteredProduct?.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-white text-xl">
                  No products found in this category yet.
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-white text-xl">
          No products Yet. Coming soon...
        </div>
      )}
    </div>
  );
};

export default AllProducts;
