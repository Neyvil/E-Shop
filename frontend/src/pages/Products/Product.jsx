import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import Default from "../../image/defaultProductImage.png";
const Product = ({ product }) => {
  return (
    <div className="w-[30rem] md:ml-[2rem] p-3 relative  ">
      <div className="relative">
        <img
          src={
            product.productImage
              ? `http://localhost:5000/${product.productImage.replace(
                  /\\/g,
                  "/"
                )}`
              : Default
          }
          alt={product.name}
          className="w-[20rem] h-[20rem] md:w-[30rem] md:h-[25rem] rounded-lg object-cover"
        />
        <Link
          to={`/product/${product._id}`}
          className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-center items-center"
        >
          <p className="text-white text-lg font-bold hover:text-[#ff0066]">
            View Product
          </p>
        </Link>
      </div>
      <HeartIcon product={product} />
      <div className=" flex mt-2 justify-between">
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

export default Product;
