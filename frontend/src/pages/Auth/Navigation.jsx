import { useState, useEffect } from "react";
import FavouritesCount from "../Products/FavouritesCount";
import {
  House,
  Store,
  Box,
  LayoutDashboard,
  Boxes,
  LogIn,
  LogOut,
  ShoppingCart,
  CircleUserRound,
  Heart,
  ShieldCheck,
  List,
  SquareUser,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useLogoutMutation,
  useCurrentProfileDetailsQuery,
} from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import img from "../../image/defaultProfile.jpg";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [profilePic, setProfilePic] = useState(img);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const { data: currentProfileData, refetch } = useCurrentProfileDetailsQuery();

  useEffect(() => {
    if (currentProfileData && currentProfileData.image) {
      const imgstr = `http://localhost:5000/${currentProfileData.image.replace(
        /\\/g,
        "/"
      )}`;
      if (imgstr) {
        setProfilePic(imgstr);
      } else {
        setProfilePic(img);
      }
    }
  }, [currentProfileData]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } font-poppins antialiased xl:flex lg:flex md:hidden sm:hidden flex-col justify-between shadow-xl  p-4 text-white bg-[#1B1C30] w-[4%] hover:w-[8rem] h-[100vh] fixed`}
      id="navigation-container"
      onMouseEnter={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
    >
      <div
        className={`${
          showSidebar ? "show-scrollbar" : ""
        } flex flex-col text-center space-y-6 mt-8 pl-4`}
      >
        <h1
          className={`font-bold text-center ${
            showSidebar ? "text-3xl" : "text-xl"
          } transition-all duration-300`}
        >
          E<span className=" text-[#ff0066]">-</span>Shop
        </h1>
        {userInfo ? (
          <NavLink
            to="/profile"
            id="profile"
            className="my-2 space-y-3 cursor-pointer"
          >
            <img
              src={profilePic}
              alt="user"
              className={`${
                showSidebar
                  ? "md:w-20 md:h-20 border-4 "
                  : "md:w-10 md:h-10 border-2"
              } rounded-full mx-auto bg-cover  border-[#ff0066]`}
            />
            <div>
              <label className=" flex items-center justify-center gap-x-1">
                {" "}
                <h2 className="font-semibold text-xs md:text-lg pl-4 text-white">
                  {userInfo.username.charAt(0).toUpperCase() +
                    userInfo.username.slice(1)}
                </h2>
                <ShieldCheck size={20} color="#ff0066" />
              </label>

              {userInfo.isAdmin ? (
                <p className=" text-sm text-bold text-[#ff0066] text-center">
                  {showSidebar ? "Admininstrator" : "Admin"}
                </p>
              ) : (
                <p className="text-sm text-bold text-[#ff0066] text-center">
                  User
                </p>
              )}
            </div>
          </NavLink>
        ) : (
          <></>
        )}

        <hr className=" mt-3 mx-2 border rounded-xl border-[#27283B]" />
        <div
          className={`${
            showSidebar ? "show-scrollbar" : ""
          } flex flex-col text-center space-y-6 mt-8 pl-4`}
        >
          <NavLink
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-5"
          >
            {({ isActive }) => (
              <>
                <House
                  size={26}
                  className="mr-2 mt-[1rem]"
                  color={isActive ? "darkviolet" : "#ff0066"}
                />
                <span className="hidden nav-item-name mt-[1rem]">HOME</span>
              </>
            )}
          </NavLink>

          {userInfo && userInfo.isAdmin ? (
            <NavLink
              to="/admin/dashboard"
              className="flex items-center transition-transform transform hover:translate-x-5"
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard
                    size={26}
                    className="mr-2 mt-[1rem]"
                    color={isActive ? "darkviolet" : "#ff0066"}
                  />
                  <span className="hidden nav-item-name mt-[1rem]">
                    DASHBOARD
                  </span>
                </>
              )}
            </NavLink>
          ) : (
            <></>
          )}
          <NavLink
            to="/store"
            className="flex items-center transition-transform transform hover:translate-x-5"
          >
            {({ isActive }) => (
              <>
                <Store
                  size={26}
                  className="mr-2 mt-[1rem]"
                  color={isActive ? "darkviolet" : "#ff0066"}
                />
                <span className="hidden nav-item-name mt-[1rem]">STORE</span>
              </>
            )}
          </NavLink>

          {userInfo && userInfo.isAdmin ? (
            <div className=" space-y-6">
              <NavLink
                to="/admin/orderlist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                {({ isActive }) => (
                  <>
                    <Box
                      size={26}
                      className="mr-2 mt-[1rem]"
                      color={isActive ? "darkviolet" : "#ff0066"}
                    />
                    <span className="hidden nav-item-name mt-[1rem]">
                      ORDERS
                    </span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/admin/categorylist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                {({ isActive }) => (
                  <>
                    <List
                      size={26}
                      className="mr-2 mt-[1rem]"
                      color={isActive ? "darkviolet" : "#ff0066"}
                    />
                    <span className="hidden nav-item-name mt-[1rem]">
                      CATEGORY
                    </span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/admin/allproductslist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                {({ isActive }) => (
                  <>
                    <Boxes
                      size={26}
                      className="mr-2 mt-[1rem]"
                      color={isActive ? "darkviolet" : "#ff0066"}
                    />
                    <span className="hidden nav-item-name mt-[1rem]">
                      PRODUCTS
                    </span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/favourite"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <Heart size={26} color="#ff0066" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  FAVOURITE
                </span>{" "}
                <FavouritesCount />
              </NavLink>
            </div>
          ) : (
            <div className=" space-y-6">
              <NavLink
                to="/cart"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                {({ isActive }) => (
                  <>
                    <ShoppingCart
                      size={26}
                      className="mr-2 mt-[1rem]"
                      color={isActive ? "darkviolet" : "#ff0066"}
                    />
                    <span className="hidden nav-item-name mt-[1rem]">CART</span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/profile"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                {({ isActive }) => (
                  <>
                    <SquareUser
                      size={26}
                      className="mr-2 mt-[1rem]"
                      color={isActive ? "darkviolet" : "#ff0066"}
                    />
                    <span className="hidden nav-item-name mt-[1rem]">
                      PROFILE
                    </span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/favourite"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <Heart size={26} color="#ff0066" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  FAVOURITE
                </span>{" "}
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {!userInfo ? (
        <ul className=" pl-4">
          <li>
            <NavLink
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-5"
            >
              <LogIn size={26} color="#ff0066" className="mr-2 mt-[2rem] " />
              <span className="hidden nav-item-name mt-[2rem]">Login</span>{" "}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className="flex items-center pb-6 transition-transform transform hover:translate-x-5"
            >
              <CircleUserRound
                size={26}
                color="#ff0066"
                className="mr-2 mt-[2rem] "
              />
              <span className="hidden nav-item-name mt-[2rem]">Register</span>{" "}
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul className="pl-4">
          <li>
            <NavLink
              onClick={logoutHandler}
              className="flex items-start pb-4 transition-transform transform cursor-pointer hover:translate-x-5"
            >
              <LogOut size={26} color="#ff0066" className="mr-2 mt-[2rem]" />
              <span className="hidden nav-item-name mt-[2rem] ">Logout</span>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
