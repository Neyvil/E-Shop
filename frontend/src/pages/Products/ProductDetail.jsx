import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useGetProductDetailQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import { Box, Clock, ShoppingCart, Star, Store } from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon.jsx";
import Default from "../../image/defaultProductImage.png";
import Ratings from "./Ratings.jsx";
import ProductTabs from "./ProductTabs.jsx";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const addToast=useToast();

  const submitHandler = async(e)=>{
    e.preventDefault()
    try {
      await createReview({
        productId,rating,comment
      }).unwrap()
      refetch()
      addToast("success","Review created successfully👍🏻");
      
    } catch (error) {
      addToast("error",error?.data?.message || error.message)      
    }
  }

  return (
    <div className="bg-[#1e1f3b] min-h-screen text-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="text-white font-semibold hover:underline">
          ← Go Back
        </Link>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="container mx-auto px-4 items-center py-10 grid lg:grid-cols-2 gap-10">
          {/* Product Image and Heart Icon */}
          <div className="relative">
            {" "}
            {/* Ensure this container is `relative` */}
            <div className="p-6 bg-[#1B1C30] shadow-lg rounded-xl">
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
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
            {/* Heart Icon placed absolutely in the top-right corner */}
          </div>

          {/* Product Details */}
          <div className="bg-[#1B1C30] p-8 relative rounded-lg shadow-lg text-white">
            <HeartIcon product={product} className="  text-[#ff0066]" />
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#ff0066] mb-4">
                {product.name}
              </h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mb-2"></div>

            <p className="text-gray-400 text-lg mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-5xl font-bold text-[#7303c0]">
                ₹ {product.price}
              </span>
              <span className="block text-gray-500 mt-2">
                Inclusive of all taxes
              </span>
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <Store className="text-[#7303c0] mr-2" />
                <span className="text-white">Brand: {product.brand}</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-[#7303c0] mr-2" />
                <span className="text-white">
                  Added: {moment(product.createAt).fromNow()}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="text-[#7303c0] mr-2" />
                <span className="text-white">
                  Reviews: {product.numReviews}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="text-[#7303c0] mr-2" />
                <span className="text-white">Ratings: {product.rating}</span>
              </div>
              <div className="flex items-center">
                <ShoppingCart className="text-[#7303c0] mr-2" />
                <span className="text-white">Quantity: {product.quantity}</span>
              </div>
              <div className="flex items-center">
                <Box className="text-[#7303c0] mr-2" />
                <span className="text-white">
                  In Stock: {product.countInStock}
                </span>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <Ratings
                value={product.rating}
                text={` ${product.numReviews} reviews`}
              />
              {product.countInStock > 0 && (
                <div>
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className=" p-2 w-[6rem] rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                //onClick={addToCartHandler}
                disabled={product.countInStock == 0}
                className="bg-[#ff0066] hover:bg-[#ff337f] text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Add to Cart
              </button>
              <button className="bg-[#7303c0] hover:bg-[#8536d0] text-white font-bold py-3 px-6 rounded-lg transition-all">
                Buy Now
              </button>
            </div>
          </div>
          <div className="bg-[#1B1C30] p-8 relative rounded-lg shadow-lg text-white lg:col-span-2">
            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem] ">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
