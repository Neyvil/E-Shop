import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "../../redux/features/favourites/favouriteSlice.js";
import Product from "./Product";

const Favourites = () => {
  const favourite = useSelector(selectFavouriteProduct);

  return (
    <div className="bg-[#1e1f3b] h-screen pt-10 px-4 md:pl-36 text-white overflow-y-auto">
      <h1 className=" font-serif font-bold text-xl md:text-2xl text-white mb-10 self-center md:self-start animate-fadeInUp">
        {" "}
        FAVOURITE{" "}
        <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
          PRODUCT
        </span>
        <div className="w-full h-1 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mt-2"></div>
      </h1>

      <div className="flex flex-wrap">
        {favourite && favourite.length !== 0 ? (
          favourite.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <>
            <h1 className=" text-gradient font-serif font-bold  bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent text-2xl">
              {" "}
              NO FAVOURITES YET ...
            </h1>
          </>
        )}
      </div>
    </div>
  );
};

export default Favourites;
