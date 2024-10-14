import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  //read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");//imp
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

const authorizeAdmin=(req,res,next)=>{
  try {
    if (req.user && req.user.role === "admin") {
      next(); 
    } else {
      
      res.status(403).json({ message: "Access denied. not authorised as admin" });
    }
  } catch (error) {
   
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
}
const authorizeSuperAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "superadmin") {
      next(); 
    } else {
      
      res.status(403).json({ message: "Access denied. Only SuperAdmin is allowed." });
    }
  } catch (error) {
  
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};


export {authenticate,authorizeAdmin,authorizeSuperAdmin};
