import { useSelector } from "react-redux";

const FavouritesCount = () => {
  const favourites = useSelector((state) => state.favourites);
  const favouriteCount = favourites.length;
  return (
    <div className=" absolute left-4 top-1 ">
      {favouriteCount > 0 && (
        <span className=" px-1 py-0 text-sm text-white bg-[#7303c0] rounded-full">
          {favouriteCount}
        </span>
      )}
    </div>
  );
};

export default FavouritesCount;
