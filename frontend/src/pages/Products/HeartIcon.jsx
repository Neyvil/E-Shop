import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  setFavourites,
} from "../../redux/features/favourites/favouriteSlice";
import {
  addFavouriteToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouriteFromLocalStorage,
} from "../../Utils/localStorage";
import { useEffect } from "react";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  const isFavourites = favourites.some((p) => p._id == product._id);

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, []);

  const toggleFavourites = () => {
    if (isFavourites) {
      dispatch(removeFromFavourites(product));
      // remove the product from the localStorage as well
      removeFavouriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavourites(product));
      // add the product to localStorage as well
      addFavouriteToLocalStorage(product);
    }
  };
  return (
    <div
      className="absolute top-6 right-10 md:right-5 cursor-pointer "
      onClick={toggleFavourites}
    >
      {isFavourites ? (
        <FaHeart className=" text-pink-600" />
      ) : (
        <FaRegHeart className="text-purple-600 text-2xl" />
      )}
    </div>
  );
};

export default HeartIcon;
