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
  console.log(currentProfileData)
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
    setProfilePic(URL.createObjectURL(file)); // Show preview of the selected image
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
    <div className="h-screen flex justify-center items-center bg-[#292B4B] overflow-y-auto">
      <section className="w-full max-w-2xl bg-[#1B1C30] rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center">
          <form onSubmit={submitHandler} className="w-full space-y-6">
            <div className="relative">
              <img
                src={profilePic}
                alt="user"
                className="w-24 h-24 rounded-full bg-cover border-4 border-violet-800"
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
                className=" flex space-x-1 absolute bottom-0 right-0"
              >
                <p className=" font-semibold text-white cursor-pointer hover:text-[#7303c0]">
                  Change Picture
                </p>

                <SquarePen
                  size={22}
                  className="text-white cursor-pointer hover:text-[#7303c0]"
                />
              </label>
            </div>
            <h1 className="text-3xl text-bold text-white">
              Update Your <span className="text-[#7303c0]">Profile</span> ✍
            </h1>
            <hr className="border-t border-[#27283B]" />
            <div className="space-y-4">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-white"
              >
                Username
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded focus:outline-none focus:bg-white focus:text-black"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]" />
                </div>
              </label>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white"
              >
                Email Address
                <div className="relative mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded focus:outline-none focus:bg-white focus:text-black"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7303c0]" />
                </div>
              </label>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white"
              >
                Password
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded focus:outline-none focus:bg-white focus:text-black"
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

              <label
                htmlFor="confirm"
                className="block text-sm font-semibold text-white"
              >
                Confirm Password
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm"
                    name="confirm"
                    className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded focus:outline-none focus:bg-white focus:text-black"
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
            <div className="flex justify-between pt-5">
              <button
                disabled={isUpdating}
                type="submit"
                className="w-[10rem] h-[3rem] rounded-3xl text-bold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer"
              >
                {isUpdating ? "Updating.." : "Update"}
              </button>
              <Link to="/orderlist" className="w-[10rem] h-[3rem] p-3 text-center rounded-3xl text-bold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer">
                My Orders
              </Link>
            </div>
            {isUpdating && (
              <div className="flex justify-center items-center my-1">
                <Loader />
              </div>
            )}
            <p className=" text-center text-white">@2024 Nabajyoti</p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;
