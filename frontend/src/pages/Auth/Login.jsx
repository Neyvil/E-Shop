import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useToast } from "../../components/Toast/ToastProvider";

import { Flame, Mail, Eye, EyeOff } from "lucide-react";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const passwordRules =
    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  //using toast
  const addToast = useToast();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  const isPasswordValid = (password) => {
    const minLength = 8;

    return password.length >= minLength;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      addToast("success", "User logged In ..");
    } catch (error) {
      addToast("error", error.data.message);
    }
  };

  return (
    <div className="h-screen">
      <section className="h-full bg-[#292B4B] flex justify-center items-center">
        <div className=" w-[40rem] h-[50rem] lg:w-[80rem] lg:h-[45rem] rounded-3xl shadow-2xl bg-[#1B1C30] flex justify-center lg:justify-evenly items-center ">
          <div className=" relative w-[30rem] h-[40rem] flex flex-col justify-evenly items-center rounded-3xl border-2 border-[#27283B] ">
            <div className=" font-poppins text-white w-[27rem]  h-[20rem] flex flex-col items-center pt-4  space-y-2">
              <Flame size={78} color="#7303c0" />
              <h1 className="text-3xl text-bold">Welcome back</h1>
              <span>
                Please enter your details to{" "}
                <span className=" text-bold">
                  Sign <span className=" text-[#7303c0]">In</span>
                </span>
              </span>
            </div>
            <div className=" w-[27rem] h-[35rem] mb-4  ">
              <form onSubmit={submitHandler} className=" container mt-12 ">
                <div className=" m-4 space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white"
                  >
                    Email Address
                  </label>

                  <div className="relative ">
                    <input
                      type="email"
                      id="email"
                      className="mt-1 p-2 border text-slate-300 rounded bg-[#1B1C30] w-full focus:bg-white focus:text-black"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7303c0]">
                      <Mail />
                    </div>
                  </div>
                </div>
                <div className=" m-4 space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white "
                  >
                    Password
                  </label>
                  <div className=" relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="mt-1 p-2 border rounded text-slate-300 w-full bg-[#1B1C30] focus:bg-white focus:text-black"
                      placeholder=" * * * * * * * *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-3 text-[#7303c0]"
                        onMouseDown={togglePasswordVisiblity}
                        onMouseUp={togglePasswordVisiblity}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                    {/* <Link className=" flex justify-end text-sm text-white hover:text-[#7303c0]">
                      forgot password ?
                    </Link> */}
                  </div>
                  {password.length > 0 && !isPasswordValid(password) && (
                    <p className="text-xs text-gray-400 mt-2">
                      {passwordRules}
                    </p>
                  )}
                </div>
                <div className=" flex justify-center pt-5 ">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-[8rem] h-[2rem] rounded-3xl text-bold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer "
                  >
                    {isLoading ? "Signing In..." : "Login"}
                  </button>
                </div>
                {isLoading && (
                  <div className=" flex justify-center items-center my-1">
                    <Loader />
                  </div>
                )}
                <hr className=" mt-8 mx-4 border rounded-xl border-[#27283B]" />
                <div className="flex justify-center text-slate-200 mt-2 ">
                  Don't have an account ?
                  <Link
                    to={
                      redirect ? `/register?redirect=${redirect}` : "/register"
                    }
                    className=" hover:underline text-bold"
                  >
                    {" "}
                    Sign <span className="text-[#7303c0]">Up</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className=" relative  lg:w-[39rem] lg:h-[40rem] border-2 border-[#27283B] rounded-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default Login;
