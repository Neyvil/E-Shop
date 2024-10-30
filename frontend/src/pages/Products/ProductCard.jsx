import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { addToCart } from "../../redux/features/cart/cartSlice";

import Default from "../../image/defaultProductImage.png";
import HeartIcon from "./HeartIcon";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ p }) => {
  return (
    <Link
      to={`/product/${p._id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative group">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            src={
              p.productImage
                ? p.productImage
                : Default
            }
            alt={p.name}
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/product/${p._id}`}
            className="bg-white text-gray-800 p-2 rounded-full mx-2 hover:bg-[#ff0066] hover:text-white transition-colors duration-300"
          >
            <Eye size={20} />
          </Link>
        </div>
        <div className="absolute top-2 right-2">
          <HeartIcon product={p} />
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-[#ff0066] text-white text-xs font-bold px-2 py-1 rounded-full">
            {p?.brand}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">
          {p?.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 h-12 overflow-hidden">
          {p?.description?.substring(0, 60)}...
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#ff0066]">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "IND",
            })}
          </span>
          <Link
            to={`/product/${p._id}`}
            className="text-sm text-[#ff0066] hover:text-pink-600 transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
