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
import { Box, Clock, ShoppingCart, Star, Store, ArrowLeft } from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon.jsx";
import Default from "../../image/defaultProductImage.png";
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
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
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

  const buyHandler = () => {
    dispatch({ ...product, qty });
    navigate("/login?redirect=/shipping");
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f3b] to-[#1B1C30]">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white hover:text-[#ff0066] transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Products</span>
        </Link>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4">
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Image Section */}
            <div className="relative group">
              <div className="overflow-hidden rounded-2xl bg-[#1B1C30] p-4 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={product.productImage || Default}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-xl"
                />
                <div className="absolute top-6 right-6 z-10">
                  <HeartIcon 
                    product={product} 
                    className="text-[#ff0066] transform hover:scale-110 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-[#1B1C30]/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-xl">
              {/* Product Header */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#ff0066] to-[#7303c0] bg-clip-text text-transparent mb-4">
                  {product.name}
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-[#ff0066] to-[#7303c0] rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-bold text-[#7303c0]">₹{product.price}</span>
                  <span className="text-gray-400 text-sm">Inclusive of all taxes</span>
                </div>
              </div>

              {/* Product Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: Store, label: "Brand", value: product.brand },
                  { icon: Clock, label: "Added", value: moment(product.createAt).fromNow() },
                  { icon: Star, label: "Reviews", value: product.numReviews },
                  { icon: Star, label: "Rating", value: product.rating.toFixed(2) },
                  { icon: Box, label: "In Stock", value: product.countInStock }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-[#1e1f3b]/50 p-3 rounded-xl">
                    <item.icon className="text-[#7303c0] w-5 h-5" />
                    <div>
                      <span className="text-gray-400 text-sm block">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4">
                {product.countInStock > 0 && (
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-gray-300">Quantity:</label>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="bg-[#1e1f3b] text-white border border-[#7303c0] rounded-lg p-2 w-24 focus:outline-none focus:ring-2 focus:ring-[#ff0066]"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-1 bg-gradient-to-r from-[#ff0066] to-[#ff337f] hover:from-[#ff337f] hover:to-[#ff0066] text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs Section */}
          <div className="bg-[#1B1C30]/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl">
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
      )}
    </div>
  );
};

export default ProductDetail;