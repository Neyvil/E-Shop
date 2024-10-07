import { Link } from "react-router-dom";
import img from "../../image/img1.jpg";

const SmallProduct = ({ product }) => {
  return (
    <div className="flex flex-col items-center space-y-4 hover:bg-[#2c2d49] transition-colors duration-300 p-4 rounded-lg">
      {/* Product Image */}
      <img
        src={
          product.productImage
            ? `http://localhost:5000/${product.productImage.replace(/\\/g, "/")}`
            : img
        }
        alt={product.name}
        className="w-[14rem] h-[10rem] rounded-lg object-cover"
      />

      {/* Product Details */}
      <div className="text-center">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold text-white">
            {product?.name?.substring(0, 20)}...
          </h2>
        </Link>
        <span className="inline-flex items-center px-2.5 py-0.5 mt-1 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:bg-gradient-to-l hover:shadow-lg transition-all duration-300">
          $ {product.price}
        </span>
      </div>
    </div>
  );
};

export default SmallProduct;
