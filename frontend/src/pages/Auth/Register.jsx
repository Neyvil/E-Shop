import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  Mail,
  UserRound,
  ShieldCheck,
  Key,
  Shield,
} from "lucide-react";
import Loader from "../../components/Loader";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    securityAnswer: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      password.length <= 12 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+=-{};:"<>,./?]/.test(password)
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role, securityAnswer } =
      formData;

    if (!username || !email || !password || !role) {
      addToast("error", "Please fill all the required fields");
      return;
    }

    if (!validateEmail(email)) {
      addToast("error", "Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      addToast("error", "Password does not meet the requirements");
      return;
    }

    if (password !== confirmPassword) {
      addToast("error", "Passwords don't match");
      return;
    }

    if (role === "superadmin" && !securityAnswer) {
      addToast(
        "error",
        "Security answer is required for SuperAdmin registration"
      );
      return;
    }

    try {
      const res = await register({
        username,
        email,
        password,
        role,
        securityAnswer,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      addToast("success", "Account successfully created");
    } catch (error) {
      addToast(
        "error",
        error?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#292B4B] flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-[#1B1C30] rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <LayoutGrid size={48} className="text-[#ff0066]" />
            <h1 className="text-2xl font-bold text-white">
              Create an account <span className="text-[#ff0066]">Nakama</span>
            </h1>
          </div>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <UserRound
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                  size={20}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                  size={20}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                8-12 characters, uppercase, lowercase, number, special character
              </p>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-white"
              >
                Role
              </label>
              <div className="relative mt-1">
                <select
                  id="role"
                  name="role"
                  className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
                <ShieldCheck
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                  size={20}
                />
              </div>
            </div>
            {formData.role === "superadmin" && (
              <div>
                <label
                  htmlFor="securityAnswer"
                  className="block text-sm font-medium text-white"
                >
                  Security Question
                </label>
                <div className="relative mt-1">
                  <p
                    className="w-full p-2 font-serif rounded bg-[#1B1C30] text-[#ff0066]"
                    onChange={handleChange}
                  > Who is Admin MJ ? </p>
                  <Shield
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                    size={20}
                  />
                </div>
                <label
                  htmlFor="securityAnswer"
                  className="block text-sm font-medium text-white"
                >
                  Security Answer
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    id="securityAnswer"
                    name="securityAnswer"
                    className="w-full p-2 border rounded bg-[#1B1C30] text-white focus:ring-2 focus:ring-[#ff0066] focus:border-transparent"
                    placeholder="Enter security answer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                  />
                  <Key
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ff0066]"
                    size={20}
                  />
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full p-2 bg-[#ff0066] text-white rounded hover:bg-[#5f02a3] transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Create Account"}
              </button>
            </div>
          </form>
          <div className="text-center text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-[#ff0066] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#7303c0] to-[#ff0066]">
          <div className="h-full flex items-center justify-center">
            <svg
              className="w-2/3 h-2/3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15V23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 18H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
