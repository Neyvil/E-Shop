import { useState, useEffect } from "react";
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
  Users,
  Heart,
  ShieldCheck,
  List,
  SquareUser,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useLogoutMutation,
  useCurrentProfileDetailsQuery,
} from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import img from "../../image/img1.jpg";

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

      setProfilePic(imgstr);
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
          E<span className=" text-[#7303c0]">-</span>Shop
        </h1>
        {userInfo ? (
          <Link
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
              } rounded-full mx-auto bg-cover  border-violet-800`}
            />
            <div>
              <label className=" flex items-center justify-center gap-x-1">
                {" "}
                <h2 className="font-semibold text-xs md:text-lg pl-4 text-white">
                  {userInfo.username.charAt(0).toUpperCase() +
                    userInfo.username.slice(1)}
                </h2>
                <ShieldCheck size={20} color="#7303c0" />
              </label>

              {userInfo.isAdmin ? (
                <p className=" text-sm text-bold text-[#7303c0] text-center">
                  {showSidebar ? "Admininstrator" : "Admin"}
                </p>
              ) : (
                <p className="text-sm text-bold text-[#7303c0] text-center">
                  User
                </p>
              )}
            </div>
          </Link>
        ) : (
          <></>
        )}

        <hr className=" mt-3 mx-2 border rounded-xl border-[#27283B]" />
        <div className={`${
          showSidebar ? "show-scrollbar" : ""
        } flex flex-col text-center space-y-6 mt-8 pl-4`}>
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-5"
          >
            <House size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
            <span className="hidden nav-item-name mt-[1rem]">HOME</span>{" "}
          </Link>

          {userInfo && userInfo.isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="flex items-center transition-transform transform hover:translate-x-5"
            >
              <LayoutDashboard
                size={26}
                color="#7303c0"
                className="mr-2 mt-[1rem] "
              />
              <span className="hidden nav-item-name mt-[1rem]">DASHBOARD</span>{" "}
            </Link>
          ) : (
            <></>
          )}
          <Link
            to="/store"
            className="flex items-center transition-transform transform hover:translate-x-5"
          >
            <Store size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
            <span className="hidden nav-item-name mt-[1rem]">STORE</span>{" "}
          </Link>

          {userInfo && userInfo.isAdmin ? (
            <div className=" space-y-6">
              <Link
                to="/admin/orderlist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <Box size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  ORDERS
                </span>{" "}
              </Link>
              <Link
                to="/admin/categorylist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <List size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  CATEGORY
                </span>{" "}
              </Link>
              <Link
                to="/admin/allproductslist"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <Boxes size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  PRODUCTS
                </span>{" "}
              </Link>

              
            </div>
          ) : (
            <div className=" space-y-6">
              <Link
                to="/cart"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <ShoppingCart
                  size={26}
                  color="#7303c0"
                  className="mr-2 mt-[1rem] "
                />
                <span className="hidden nav-item-name mt-[1rem]">CART</span>{" "}
              </Link>
              <Link
                to="/profile"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <SquareUser
                  size={26}
                  color="#7303c0"
                  className="mr-2 mt-[1rem] "
                />
                <span className="hidden nav-item-name mt-[1rem]">PROFILE</span>{" "}
              </Link>
              <Link
                to="/favourite"
                className="flex items-center transition-transform transform hover:translate-x-5"
              >
                <Heart size={26} color="#7303c0" className="mr-2 mt-[1rem] " />
                <span className="hidden nav-item-name mt-[1rem]">
                  FAVOURITE
                </span>{" "}
              </Link>
            </div>
          )}
        </div>
      </div>

      {!userInfo ? (
        <ul className=" pl-4">
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-5"
            >
              <LogIn size={26} color="#7303c0" className="mr-2 mt-[2rem] " />
              <span className="hidden nav-item-name mt-[2rem]">Login</span>{" "}
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center pb-6 transition-transform transform hover:translate-x-5"
            >
              <CircleUserRound
                size={26}
                color="#7303c0"
                className="mr-2 mt-[2rem] "
              />
              <span className="hidden nav-item-name mt-[2rem]">Register</span>{" "}
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="pl-4">
          <li>
            <Link
              onClick={logoutHandler}
              className="flex items-start pb-4 transition-transform transform cursor-pointer hover:translate-x-5"
            >
              <LogOut size={26} color="#7303c0" className="mr-2 mt-[2rem]" />
              <span className="hidden nav-item-name mt-[2rem] ">Logout</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
