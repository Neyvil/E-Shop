import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "./Toast/ToastProvider";
import { useEffect } from "react";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
