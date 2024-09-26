import { Link } from "react-router-dom";
import img from "../../image/img1.jpg";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3 ">
      <div className="relative">
        <img
          src={
            product.productImage
              ? `http://localhost:5000/${product.productImage.replace(/\\/g, "/")}`
              : img
          }
          alt={product.name}
          className="h-[20rem] rounded bg-contain"
        />
        <div className="p-54">
          <Link to={`/product/${product._id}`}>
          <h2 className=" flex justify-between items-center pt-2">
            <div className=" text-white font-serif">{product?.name?.substring(0,20)}...</div>
            <span className="inline-flex items-center mr-6 px-2.5 py-0.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:bg-gradient-to-l hover:shadow-lg transition-all duration-300">
              $ {product.price}
            </span>
          </h2>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default SmallProduct;
