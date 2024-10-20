import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { addToCart } from "../../redux/features/cart/cartSlice.js";
import ProductTabs from "./ProductTabs.jsx";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const addToast = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      addToast("success", "Review created successfully👍🏻");
    } catch (error) {
      addToast("error", error?.data || error.message);
    }
  };

  const buyHandler= ()=>{
    dispatch({ ...product, qty })
    navigate("/login?redirect=/shipping");
  }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <div className="bg-[#1e1f3b] min-h-screen text-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4 md:py-6">
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
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Product Image and Heart Icon */}
          <div className="relative">
            <div className="p-4 sm:p-6 bg-[#1B1C30] shadow-lg rounded-xl">
              <img
                src={
                  product.productImage
                    ? `https://e-shop-backend-ep6p.onrender.com/${product.productImage.replace(
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
            <div className="absolute top-4 right-4">
              <HeartIcon product={product} className="text-[#ff0066]" />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-[#1B1C30] p-6 md:p-8 relative rounded-lg shadow-lg text-white">
            <div className="relative mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ff0066] mb-4">
                {product.name}
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mb-2"></div>
            </div>

            <p className="text-gray-400 text-base sm:text-lg mb-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#7303c0]">
                ₹ {product.price}
              </span>
              <span className="block text-gray-500 mt-1 md:mt-2 text-sm">
                Inclusive of all taxes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <Store className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  Brand: {product.brand}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  Added: {moment(product.createAt).fromNow()}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  Reviews: {product.numReviews}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  Ratings: {product.rating.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center">
                <ShoppingCart className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  Quantity: {product.quantity}
                </span>
              </div>
              <div className="flex items-center">
                <Box className="text-[#7303c0] mr-2" />
                <span className="text-white text-sm sm:text-base">
                  In Stock: {product.countInStock}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
              <div>
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="p-2 w-full md:w-[6rem] rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex space-x-4 w-full md:w-auto">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock == 0}
                  className="bg-[#ff0066] hover:bg-[#ff337f] w-full py-2 px-6 rounded-lg font-bold transition-all"
                >
                  Add to Cart
                </button>
                <button 
                onClick={buyHandler}
                disabled={product.countInStock == 0}
                className="bg-[#7303c0] hover:bg-[#8536d0] w-full py-2 px-6 rounded-lg font-bold transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Product Tabs (Reviews, Description, ratings) */}
          <div className=" p-6 md:p-8  text-white lg:col-span-2">
            <div className="container">
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
