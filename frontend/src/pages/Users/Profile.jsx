import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useCurrentProfileDetailsQuery,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { SquarePen } from "lucide-react";
import img from "../../image/defaultProfile.jpg";
import { Eye, EyeOff, Mail, UserRound } from "lucide-react";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);

  const addToast = useToast();
  const dispatch = useDispatch();
  
  const [updateProfile, { isLoading: isUpdating }] = useProfileMutation();

  const [profilePic, setProfilePic] = useState(img);

  const { data: currentProfileData, refetch } = useCurrentProfileDetailsQuery();
  const passwordRules =
    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

  useEffect(() => {
    if (currentProfileData) {
      if (currentProfileData.profileImage) {

        setProfilePic(currentProfileData.profileImage);
      }
      setUsername(currentProfileData.username);
    
      setEmail(currentProfileData.email);
      refetch();
    }
  }, [currentProfileData, refetch]);

  const changeProfileImageHandler = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setProfilePic(URL.createObjectURL(file)); 
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const isPasswordValid = (password) => {
    const minLength = 8;
    return password.length >= minLength;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", image);
    formData.append("username", username);
    formData.append("email", email);
    if (password === confirm) {
      formData.append("password", password);
    } else {
      addToast("error", "Password doesn't match");
      return;
    }

    try {
      const res = await updateProfile(formData).unwrap();
      addToast("success", "Profile updated successfully 🤞");
      dispatch(setCredentials(res));
      if (res.profieImage) {
        setProfilePic(res.profieImage); 
      }
    } catch (error) {
      console.error(error);
      addToast("error", "Profile not updated");
    }
  };
  return (
    <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[#292B4B]">
      <section className="w-full max-w-2xl bg-[#1B1C30] rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6 text-center">
            Profile{" "}
            <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          
          <form onSubmit={submitHandler} className="w-full space-y-4 md:space-y-6">
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                <img
                  src={profilePic}
                  alt="user"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#ff0066]"
                />
                <input
                  type="file"
                  id="fileInput"
                  name="profileImage"
                  className="hidden"
                  onChange={changeProfileImageHandler}
                />
                <label
                  htmlFor="fileInput"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-[#292B4B] px-3 py-1 rounded-full cursor-pointer hover:bg-[#27283B] transition-colors duration-300"
                >
                  <p className="text-sm font-semibold text-white">Change</p>
                  <SquarePen size={16} className="text-[#ff0066]" />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Update Your <span className="text-[#ff0066]">Profile</span> ✍
                </h2>
                <hr className="border-t border-[#27283B] mb-6" />
              </div>

              <div className="grid gap-4 md:gap-6">
                <label className="block">
                  <span className="text-sm font-semibold text-white mb-1 block">Username</span>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-3 text-slate-300 bg-[#292B4B] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0066] focus:border-transparent transition-all duration-300"
                      placeholder="Enter Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-white mb-1 block">Email Address</span>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full p-3 text-slate-300 bg-[#292B4B] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0066] focus:border-transparent transition-all duration-300"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-white mb-1 block">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full p-3 text-slate-300 bg-[#292B4B] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0066] focus:border-transparent transition-all duration-300"
                      placeholder="* * * * * * * *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]"
                        onMouseDown={togglePasswordVisibility}
                        onMouseUp={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                  </div>
                  {password.length > 0 && !isPasswordValid(password) && (
                    <p className="text-xs text-gray-400 mt-2">{passwordRules}</p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-white mb-1 block">Confirm Password</span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full p-3 text-slate-300 bg-[#292B4B] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0066] focus:border-transparent transition-all duration-300"
                      placeholder="* * * * * * * *"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    {confirm.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]"
                        onMouseDown={toggleConfirmPasswordVisibility}
                        onMouseUp={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
                <button
                  disabled={isUpdating}
                  type="submit"
                  className="w-full md:w-[12rem] h-12 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </button>
                <Link 
                  to="/cart" 
                  className="w-full md:w-[12rem] h-12 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1"
                >
                  My Orders
                </Link>
              </div>
            </div>

            {isUpdating && (
              <div className="flex justify-center items-center my-4">
                <Loader />
              </div>
            )}
            
            <p className="text-center text-white text-sm mt-6">@2024 Nabajyoti</p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;