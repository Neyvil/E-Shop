import ProductCarousel from "../pages/Products/ProductCarousel.jsx";
import SmallProduct from "../pages/Products/SmallProduct.jsx";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1> ERROR </h1>;
  }

  return (
    <div className="bg-[#1e1f3b] py-8 text-white">
      {/* Welcome Text */}
      <div className="text-center mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold ">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">E-Shop by Nabajyoti</span>
        </h1>
        <p className="text-lg mt-2 animate-fadeIn">Find the best products curated just for you</p>
      </div>

      {/* Main Container */}
      <div className="container mx-auto flex flex-col-reverse lg:flex-row justify-between items-start gap-12 px-4">
        
        {/* Left Side: Small Products */}
        <div className="flex-1 w-full lg:w-[35%]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 animate-fadeInUp">
            {data.map((product) => (
              <div
                key={product._id}
                className="p-2 flex justify-center"
              >
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Carousel */}
        <div className="flex-1 w-full lg:w-[65%]">
          <ProductCarousel />
        </div>
      </div>
    </div>
  );
};

export default Header;
