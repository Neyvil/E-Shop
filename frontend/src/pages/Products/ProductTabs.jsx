import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#1B1C30] p-8 rounded-lg shadow-xl space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Tabs Header */}
      <section className="lg:w-[20%] w-full flex flex-col gap-4">
        <div
          className={`p-4 cursor-pointer text-lg font-semibold transition-all duration-300 rounded-lg ${
            activeTab === 1
              ? "bg-gradient-to-r from-[#7303c0] to-[#ff0066] text-white shadow-lg"
              : "text-gray-400 hover:text-[#ff0066] hover:bg-[#333] hover:shadow-lg"
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`p-4 cursor-pointer text-lg font-semibold transition-all duration-300 rounded-lg ${
            activeTab === 2
              ? "bg-gradient-to-r from-[#7303c0] to-[#ff0066] text-white shadow-lg"
              : "text-gray-400 hover:text-[#ff0066] hover:bg-[#333] hover:shadow-lg"
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`p-4 cursor-pointer text-lg font-semibold transition-all duration-300 rounded-lg ${
            activeTab === 3
              ? "bg-gradient-to-r from-[#7303c0] to-[#ff0066] text-white shadow-lg"
              : "text-gray-400 hover:text-[#ff0066] hover:bg-[#333] hover:shadow-lg"
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* Tabs Content */}
      <section className="w-full">
        {/* Write a Review Tab */}
        {activeTab === 1 && (
          <div className="bg-[#1A1B2E] p-8 rounded-lg shadow-lg">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-xl text-[#ff0066] font-bold mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border border-gray-600 rounded-lg text-black focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-xl text-[#ff0066] font-bold mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full p-4 border border-gray-600 rounded-lg text-black focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Leave a comment..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="mt-4 bg-gradient-to-r from-[#7303c0] to-[#ff0066] hover:from-[#8536d0] hover:to-[#ff337f] text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-gray-400">
                Please <Link to="/login" className="text-[#ff0066] underline">sign in</Link> to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div>
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#2A2B3F] p-4 rounded-lg shadow-md mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-[#ff0066]">{review.name}</strong>
                    <p className="text-sm text-gray-500">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>
                  <p className="text-gray-300 mb-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div className="bg-[#1A1B2E] p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
