import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { ShoppingBag, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, ShoppingCart, Package, CreditCard, Truck } from "lucide-react";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const addToast = useToast();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      addToast("success", "Welcome back! You've successfully logged in.");
    } catch (error) {
      addToast("error","Login failed. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (email) {
      setStep(2);
    } else {
      addToast("error", "Please enter your email address");
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1f3b] to-[#292B4B] p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-10 space-y-8 transition-all duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center space-x-3 mb-10">
            <ShoppingBag size={48} className="text-[#ff0066]" />
            <h1 className="text-4xl font-bold text-[#1e1f3b]">Welcome Back</h1>
          </div>
          <form onSubmit={submitHandler} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <label htmlFor="email" className="block text-lg font-medium text-[#1e1f3b]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7303c0] focus:border-transparent text-lg transition-all duration-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-[#ff0066] text-white py-3 rounded-lg hover:bg-[#e6005c] transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
                >
                  Next
                  <ArrowRight className="ml-2" size={24} />
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <label htmlFor="password" className="block text-lg font-medium text-[#1e1f3b]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7303c0] focus:border-transparent text-lg transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="w-1/2 bg-gray-200 text-[#1e1f3b] py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
                  >
                    <ArrowLeft className="mr-2" size={24} />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#7303c0] text-white py-3 rounded-lg hover:bg-[#5f02a3] transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
                {isLoading?( <div className="flex justify-center items-center h-screen bg-[#1e1f3b]">
        <Loader />
      </div>):""}
              </div>
            )}
          </form>
          <div className="text-center text-lg">
            <span className="text-[#1e1f3b]">Don't have an account? </span>
            <Link to="/register" className="text-[#ff0066] hover:underline font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 bg-[#292B4B] items-center justify-center p-12">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0066] to-[#7303c0] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10 grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center space-y-4">
                <ShoppingCart size={64} className="text-white" />
                <span className="text-white text-lg font-semibold">Shop</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Package size={64} className="text-white" />
                <span className="text-white text-lg font-semibold">Products</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <CreditCard size={64} className="text-white" />
                <span className="text-white text-lg font-semibold">Pay</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Truck size={64} className="text-white" />
                <span className="text-white text-lg font-semibold">Deliver</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;