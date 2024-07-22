import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toast/ToastProvider";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { Eye, EyeOff, LayoutGrid, Mail, UserRound } from "lucide-react";

function Register() {
  const [username, setUserName] = useState("");
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules =
    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const isPasswordValid = (password) => {
    const minLength = 8;

    return password.length >= minLength;
  };

  const addToast = useToast();
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (confirm !== password) {
      addToast("error","Password don't match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        addToast("success", "Account successfully created");
      } catch (error) {
        console.error(error);
        addToast("error", error.data.message);
      }
    }
  };

  return (
    <div className="h-screen">
      <section className=" h-full bg-[#292B4B] flex justify-center items-center">
        <div className=" w-[44rem] h-[54rem] lg:w-[84rem] lg:h-[50rem] rounded-3xl shadow-2xl bg-[#1B1C30] flex justify-center lg:justify-evenly items-center">
          <div className="relative w-[38rem] h-[46rem] flex flex-col justify-evenly items-center rounded-3xl border-2 border-[#27283B]">
            <div className=" w-full h-[12rem] mt-2 flex flex-col justify-center items-center space-y-5">
              <LayoutGrid
                size={65}
                className=" rounded-xl rotate-45 text-[#7303c0] shadow-lg "
              />

              <h1 className=" text-bold tracking-wider text-white text-2xl">
                Create an account <span className=" text-[#7303c0]">Nakama</span>
              </h1>
            </div>
            <div className="w-full h-full">
              <hr className=" mt-5 mx-4 border rounded-xl border-[#27283B]" />

              <form onSubmit={submitHandler} className=" container mt-8 px-4 ">
                <div className=" mx-4 space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-white"
                  >
                    Username
                  </label>

                  <div className="relative ">
                    <input
                      type="text"
                      id="name"
                      className="mt-1 p-2 border text-slate-300 rounded bg-[#1B1C30] w-full focus:bg-white focus:text-black"
                      placeholder="Enter Username"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7303c0]">
                      <UserRound />
                    </div>
                  </div>
                </div>
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
                <div className="m-4 space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7303c0]"
                        onMouseDown={togglePasswordVisibility}
                        onMouseUp={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                  </div>
                  {password.length > 0 && !isPasswordValid(password) && (
                    <p className="text-xs text-gray-400 mt-2">
                      {passwordRules}
                    </p>
                  )}
                </div>

                <div className=" m-4 space-y-2">
                  <label
                    htmlFor="confirmpassword"
                    className="block text-sm font-semibold text-white "
                  >
                    Confirm Password
                  </label>
                  <div className=" relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmpassword"
                      className="mt-1 p-2 border rounded text-slate-300 w-full bg-[#1B1C30] focus:bg-white focus:text-black"
                      placeholder=" * * * * * * * *"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    {confirm.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-3 text-[#7303c0]"
                        onMouseDown={toggleConfirmPasswordVisibility}
                        onMouseUp={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                  </div>
                </div>
                <div className=" flex justify-center pt-5 ">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-[12rem] h-[2rem] rounded-3xl text-bold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer "
                  >
                    {isLoading ? "Registering..." : "Create account"}
                  </button>
                </div>
                {isLoading && (
                  <div className=" flex justify-center items-center my-1">
                    <Loader />
                  </div>
                )}

                <div className="flex justify-center text-slate-200 mt-4 ">
                  Been here before ?
                  <Link
                    to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    className=" hover:underline text-bold"
                  >
                    {" "}
                    Sign <span className="text-[#7303c0]">In</span>
                  </Link>
                </div>
              </form>
            </div>
            <div className=" w-full text-slate-300 text-sm flex   ">
              <p className="absolute bottom-0 left-0 p-3">@2024 Nabajyoti</p>
              <div className="flex absolute gap-2 p-3 bottom-0 right-0">
                <p>Terms</p>
                <p>Privacy</p>
              </div>
            </div>
          </div>
          <div className=" lg:w-[38rem] lg:h-[46rem] flex flex-col justify-evenly items-center rounded-3xl border-2 border-[#27283B]"></div>
        </div>
      </section>
    </div>
  );
}

export default Register;
