import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import img from "../../image/img1.jpg";
import moment from "moment";
import { Trash, FilePenLine, X } from "lucide-react";

const UserList = () => {
  const { data: users, refetch, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [role, setRole] = useState("");

  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const addtoast = useToast();

  useEffect(() => {
    refetch();
    if (selectedUser) {
      setEditableUserName(selectedUser.username);
      setEditableUserEmail(selectedUser.email);
      setRole(selectedUser.isAdmin ? "Admin" : "User");
    }
  }, [refetch, selectedUser]);

  const userClickHandler = (user) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const deleteUserHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res =await deleteUser(id)
        if(res.error){
          addtoast("error",res.error.data.message)
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred";
        addtoast("error", errorMessage);
      }
    }
  };

  const updateHandler = async () => {
    try {
      const payload = {
        userId: selectedUser._id,
        username: editableUserName,
        email: editableUserEmail,
        isAdmin: role === "Admin", // boolean converted through "===" comparator operator
      };

      await updateUser(payload);
      addtoast("success", `${payload.username} profile updated`);
      refetch();
      setShowProfile(false);
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "An error occurred";
      addtoast("error", errorMessage);
    }
  };

  return (
    <div className="h-screen flex font-sans justify-center items-center bg-[#292B4B] overflow-y-auto">
      <section className="w-[85%] bg-[#1B1C30] shadow-xl p-[2rem] text-center rounded-xl">
        <h1 className="text-4xl font-serif font-bold text-white lg:mt-0 mb-4">
          Users <span className="text-[#7303c0]">Details</span>
        </h1>
        <p className="text-xl text-slate-200 -mt-4 mb-6">
          Total Users:{" "}
          <span className="text-[#7303c0]">{users ? users.length : 0}</span>
        </p>
        <div className="flex lg:justify-between items-center lg:flex-row flex-col">
          <div className="w-full mt-4 max-h-[40vh] lg:max-h-[60vh] overflow-auto border-collapse">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#2A2C4A] z-10">
                <tr>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    id
                  </th>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    Avatar
                  </th>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    Username
                  </th>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    Email
                  </th>
                  <th
                    className={`${
                      showProfile
                        ? "hidden"
                        : "text-white font-bold m-6 font-serif text-xl"
                    }`}
                  >
                    Operation
                  </th>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    Role
                  </th>
                  <th className="text-white font-bold m-6 font-serif text-xl">
                    Since
                  </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user._id} className="bg-[#24253C]">
                      <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                        {user._id ? user._id.slice(-8) : user._id}
                      </td>
                      <td className="flex-col pl-8 h-[100%] border-b-2 border-solid border-[#7303c0]">
                        <img
                          src={
                            user.image
                              ? `http://localhost:5000/${user.image.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : img
                          }
                          alt={user.username}
                          className="w-12 h-12 border-b-2 border-solid border-[#7303c0] rounded-lg"
                        />
                      </td>
                      <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                        {user.username}
                      </td>
                      <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                        {user.email}
                      </td>
                      <td
                        className={`${
                          showProfile
                            ? "hidden"
                            : "border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle"
                        }`}
                      >
                        <div className="w-full flex items-center justify-center space-y-2 lg:justify-center lg:flex-row flex-col space-x-5">
                          <button onClick={() => deleteUserHandler(user._id)}>
                            <Trash color="#7303c0" size={30} />
                          </button>
                          <button
                            onClick={() => {
                              userClickHandler(user);
                            }}
                          >
                            <FilePenLine color="#7303c0" size={30} />
                          </button>
                        </div>
                      </td>
                      <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                        {user.isAdmin ? "Admin" : "User"}
                      </td>
                      <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                        {user.createdAt
                          ? moment(user.createdAt).format("YYYY-MM-DD")
                          : user.createdAt}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div
            className={`${
              showProfile && selectedUser
                ? "w-[90%] lg:w-[30%] flex justify-center py-3 mt-3 items-center relative"
                : "hidden"
            }`}
          >
            {selectedUser && (
              <div className="w-[89%] h-full flex flex-col items-center pt-4 shadow-lg shadow-[#7303c0] rounded-2xl">
                <button
                  className="absolute top-4 right-8 p-1 rounded-lg hover:bg-[#7303c0]"
                  onClick={handleCloseProfile}
                >
                  <X color="white" />
                </button>

                <div className="mt-2 flex flex-col items-center">
                  <img
                    src={
                      selectedUser.image
                        ? `http://localhost:5000/${selectedUser.image.replace(
                            /\\/g,
                            "/"
                          )}`
                        : img
                    }
                    alt={selectedUser.username}
                    className=" w-12 h-12 lg:w-20 lg:h-20 mb-2 rounded-full border-b-2 border-solid border-[#7303c0]"
                  />
                  <p className="font-serif text-lg text-white">
                    {selectedUser.username}
                  </p>
                  <p className="font-serif text-sm text-[#7303c0]">
                    {selectedUser.isAdmin ? "Administrator" : "User"}
                  </p>
                </div>
                <div className="w-full my-4 flex space-y-5 flex-col items-center">
                  <label
                    htmlFor="username"
                    className="text-wrap text-white font-serif text-sm lg:text-[1rem]"
                  >
                    Username:{" "}
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="pl-2 bg-[#1B1C30] w-[55%] focus:outline-none text-slate-500 focus:bg-[#292B4B] focus:text-white ml-1 text-[1rem] rounded"
                      id="username"
                      value={editableUserName}
                      onChange={(e) => setEditableUserName(e.target.value)}
                    />
                  </label>
                  <label
                    htmlFor="email"
                    className="text-wrap text-white font-serif text-[1rem]"
                  >
                    Email:{" "}
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="pl-2 bg-[#1B1C30] w-[75%] focus:outline-none text-slate-500 focus:bg-[#292B4B] focus:text-white ml-1 text-[1rem] rounded"
                      id="email"
                      value={editableUserEmail}
                      onChange={(e) => setEditableUserEmail(e.target.value)}
                    />
                  </label>
                  <label
                    htmlFor="adminSelection"
                    className="text-white font-serif text-[1rem]"
                  >
                    Role :{" "}
                    <select
                      name=""
                      id="adminSelection"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                      }}
                      className="bg-[#292B4B] text-center w-[60%] ml-2 rounded p-1"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </label>
                  <div className="pt-4">
                    <button
                      disabled={isUpdating}
                      type="button"
                      className="w-[10rem] h-[2rem] rounded-3xl text-bold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer"
                      onClick={updateHandler}
                    >
                      {isUpdating ? "Updating.." : "Update"}
                    </button>
                    {isUpdating && (
                      <div className="flex justify-center items-center my-1">
                        <Loader />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserList;
