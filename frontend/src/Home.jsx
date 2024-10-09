import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Message from "./components/Message.jsx";
import Loader from "./components/Loader.jsx";
import Header from "./components/Header.jsx";
import Product from "./pages/Products/Product";
import HeartIcon from "./pages/Products/HeartIcon.jsx";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-[#1e1f3b] min-h-screen text-white overflow-x-auto">
      {!keyword ? <Header /> : null}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="error">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center bg-[#1e1f3b] py-4 px-6 md:px-10 lg:px-[10rem] animate-fadeInUp ">
            <h1 className="text-[2rem] md:text-[3rem] font-bold">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 hover:bg-pink-700 transition duration-300 font-bold rounded-full py-2 px-6 md:px-10 text-sm md:text-base"
            >
              Shop
            </Link>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mt-2"></div>

          <div className="flex flex-wrap justify-center gap-4 mt-[2rem] px-4 md:px-8 lg:px-[10rem]">
            {data.products.map((product) => (
              <div
                key={product._id}
                className="transform hover:scale-105 transition duration-300"
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
