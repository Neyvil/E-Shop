import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "../../redux/features/favourites/favouriteSlice.js";
import Product from "./Product";
import { Heart } from "lucide-react";

const Favourites = () => {
  const favourite = useSelector(selectFavouriteProduct);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f3b] to-[#1B1C30]">
      {/* Header Section */}
      <div className="container mx-auto px-4 lg:px-8 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-[#ff0066] animate-pulse" />
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              My Favourite{" "}
              <span className="bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
                Products
              </span>
            </h1>
          </div>
          
          
        </div>
<div className="h-1 w-full bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mb-12"></div>
        {/* Products Grid */}
        {favourite && favourite.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {favourite.map((product) => (
              <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                <Product product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
            <Heart className="w-20 h-20 text-[#ff0066]/30 animate-pulse" />
            <div className="text-center space-y-4">
              <h2 className="font-serif font-bold text-2xl md:text-3xl bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
                No Favourites Yet
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Start adding products to your favourites list by clicking the heart icon on products you love!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Floating Action Button for Mobile */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 lg:hidden"
      >
        <Heart className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};



export default Favourites;