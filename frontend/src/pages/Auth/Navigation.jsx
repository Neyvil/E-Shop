import React, { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useCurrentProfileDetailsQuery,
} from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import img from "../../image/defaultProfile.jpg";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [profilePic, setProfilePic] = useState(img);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const { data: currentProfileData } = useCurrentProfileDetailsQuery();

  useEffect(() => {
    if (currentProfileData && currentProfileData.image) {
      const imgstr = `https://e-shopbackend-bnov.onrender.com${currentProfileData.image}`;
      setProfilePic(imgstr || img);
    }
  }, [currentProfileData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const MobileNavItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
      to={to}
      className="flex items-center p-4 hover:bg-[#27283B] transition-all duration-300"
      onClick={() => {
        if (onClick) onClick();
        toggleDropdown();
      }}
    >
      <Icon size={24} className="mr-4" color="#ff0066" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="xl:hidden lg:hidden md:block sm:block fixed top-0 left-0 right-0 z-50">
        <div
          className={`flex justify-between items-center bg-[#1B1C30] p-4 transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <button className="text-white" onClick={toggleDropdown}>
            {dropdownOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1
            className={`font-bold text-white text-center transition-all duration-300 ${
              scrolled ? "text-2xl" : "text-4xl"
            }`}
          >
            E<span className="text-[#ff0066]">-</span>Shop
          </h1>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </div>

        {/* Dropdown Menu for Mobile */}
        <div
          className={`fixed top-[64px] left-0 w-full bg-[#1B1C30] transition-all duration-300 text-white ease-in-out overflow-y-auto ${
            dropdownOpen
              ? "h-[calc(100vh-64px)] opacity-100"
              : "h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4">
            {userInfo && (
              <div className="flex items-center mb-6">
                <img
                  src={profilePic}
                  alt="user"
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#ff0066]"
                />
                <div>
                  <h2 className="text-white font-semibold">
                    {userInfo.username.charAt(0).toUpperCase() +
                      userInfo.username.slice(1)}
                  </h2>
                  <div className="text-[#ff0066] font-serif font-semibold flex items-center">
                    {userInfo.role === "superadmin"
                      ? "SuperAdmin"
                      : userInfo.role === "admin"
                      ? "Administrator"
                      : "User"}
                    <ShieldCheck size={16} color="#ff0066" className="ml-1" />
                  </div>
                </div>
              </div>
            )}

            <MobileNavItem to="/" icon={House} label="HOME" />
            {userInfo &&
              (userInfo.role === "admin" || userInfo.role === "superadmin") && (
                <>
                  <MobileNavItem
                    to="/admin/dashboard"
                    icon={LayoutDashboard}
                    label="DASHBOARD"
                  />
                  <MobileNavItem
                    to="/admin/orderlist"
                    icon={Box}
                    label="ORDERS"
                  />
                  <MobileNavItem
                    to="/admin/categorylist"
                    icon={List}
                    label="CATEGORY"
                  />
                  <MobileNavItem
                    to="/admin/allproductslist"
                    icon={Boxes}
                    label="PRODUCTS"
                  />
                </>
              )}
            <MobileNavItem to="/shop" icon={Store} label="STORE" />
            <MobileNavItem
              to="/cart"
              icon={ShoppingCart}
              label={`CART (${cartItems.reduce((a, c) => a + c.qty, 0)})`}
            />
            <MobileNavItem to="/favourite" icon={Heart} label="FAVOURITE" />
            <MobileNavItem to="/profile" icon={SquareUser} label="PROFILE" />

            {!userInfo ? (
              <>
                <MobileNavItem to="/login" icon={LogIn} label="Login" />
                <MobileNavItem
                  to="/register"
                  icon={CircleUserRound}
                  label="Register"
                />
              </>
            ) : (
              <MobileNavItem
                to="#"
                icon={LogOut}
                label="Logout"
                onClick={logoutHandler}
              />
            )}
          </div>
        </div>
      </div>
      {/* Desktop Navigation */}
      <div
        style={{ zIndex: 999 }}
        className="hidden xl:flex lg:flex md:hidden sm:hidden font-poppins antialiased flex-col justify-between shadow-xl p-4 text-white bg-[#1B1C30] w-[4%] hover:w-[8rem] h-[100vh] fixed"
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
                <div className=" text-[#ff0066] font-serif font-semibold">
                  {userInfo && userInfo.role === "superadmin"
                    ? showSidebar
                      ? "SuperAdmin"
                      : "Sadmin"
                    : userInfo.role === "admin"
                    ? showSidebar
                      ? "Administrator"
                      : "Admin"
                    : "User"}
                </div>
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

            {userInfo &&
            (userInfo.role === "admin" || userInfo.role === "superadmin") ? (
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
              to="/shop"
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

            {userInfo &&
            (userInfo.role === "admin" || userInfo.role === "superadmin") ? (
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
                  <Heart
                    size={26}
                    color="#ff0066"
                    className="mr-2 mt-[1rem] "
                  />
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
                      <span className="hidden nav-item-name mt-[1rem]">
                        CART
                      </span>
                      <div className="absolute top-1 ">
                        {cartItems.length > 0 && (
                          <span>
                            <span className=" px-1 py-0 text-sm text-white bg-violet-700 rounded-full">
                              {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                          </span>
                        )}
                      </div>
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
                  <Heart
                    size={26}
                    color="#ff0066"
                    className="mr-2 mt-[1rem] "
                  />
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
                <span className="hidden nav-item-name mt-[2rem]">
                  Login
                </span>{" "}
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
    </>
  );
};

export default Navigation;
