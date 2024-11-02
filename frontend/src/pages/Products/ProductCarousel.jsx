import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import img from "../../image/img1.jpg";

import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true, // Use fade effect
    pauseOnHover: false, // Keep autoplay even when hovering
  };

  return (
    <div className="mb-8 mx-auto lg:w-4/5 xl:w-4/5 md:w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="rounded-lg shadow-lg">
          {products.map(
            ({
              productImage,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="relative">
                <img
                  src={
                    productImage
                      ? productImage
                      : img
                  }
                  alt={name}
                  className="w-full rounded-lg object-cover h-[32rem] transition-transform duration-700 hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg text-white">
                  <h2 className="text-2xl font-semibold mb-2">{name}</h2>
                  <p className="text-lg">$ {price}</p>
                  <p className="mt-2">{description.substring(0, 170)} ...</p>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <h1 className="flex items-center mb-2">
                        <FaStore className="mr-2" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-2">
                        <FaClock className="mr-2" /> Added: {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-2">
                        <FaStar className="mr-2" /> Reviews: {numReviews}
                      </h1>
                    </div>

                    <div>
                      <h1 className="flex items-center mb-2">
                        <FaStar className="mr-2" /> Rating: {Math.round(rating)}
                      </h1>
                      
                      <h1 className="flex items-center mb-2">
                        <FaBox className="mr-2" /> In Stock: {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
