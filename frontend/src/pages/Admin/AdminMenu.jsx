import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-8 right-4 ">
      {" "}
      {/* Fixed position at the top-right corner */}
      {/* Menu Icon */}
      <div
        className="w-9 h-9 rounded bg-[#1B1C30] cursor-pointer flex items-center justify-center hover:text-[#7303c0] transition duration-300 ease-in-out transform hover:scale-110"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <X size={24} color="white" /> // Show cross icon when menu is open
        ) : (
          <Menu size={24} color="white" /> // Show menu icon when menu is closed
        )}
      </div>
      {/* Menu Content */}
      <div
        className={`fixed top-8 -z-10 right-4 w-48 bg-[#1B1C30] p-4 rounded-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        {/* Your menu content goes here */}
        <ul>
          <li className="mt-3 text-center ">
            <NavLink
              className="text-white hover:text-[#7303c0] cursor-pointer "
              to="/admin/dashboard"
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              Admin DashBoard
            </NavLink>
          </li>

          <li className="mt-3 text-center ">
            <NavLink
              className="text-white hover:text-[#7303c0] cursor-pointer "
              to="/admin/categorylist"
              style={({ isActive }) => ({
                color: isActive ? "darkviolet" : "white",
              })}
            >
              Manage Category
            </NavLink>
          </li>
          <li className="mt-3 text-center ">
            <NavLink
              className="text-white hover:text-[#7303c0] cursor-pointer "
              to="/admin/productlist"
              style={({ isActive }) => ({
                color: isActive ? "darkviolet" : "white",
              })}
            >
              Create Product
            </NavLink>
          </li>
          <li className="mt-3 text-center ">
            <NavLink
              className="text-white hover:text-[#7303c0] cursor-pointer "
              to="/admin/allproductslist"
              style={({ isActive }) => ({
                color: isActive ? "darkviolet" : "white",
              })}
            >
              All Products
            </NavLink>
          </li>
          <li className="mt-3 text-center ">
            <NavLink
              className="text-white hover:text-[#7303c0] cursor-pointer "
              to="/admin/userlist"
              style={({ isActive }) => ({
                color: isActive ? "darkviolet" : "white",
              })}
            >
              Manage Users
            </NavLink>
          </li>
          <li className="mt-3 hover:text-[#7303c0] text-center ">
            <NavLink
              className="text-white  cursor-pointer "
              to="/admin/userlist"
              style={({ isActive }) => ({
                color: isActive ? "darkviolet" : "white",
              })}
            >
              Manage Orders
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminMenu;
