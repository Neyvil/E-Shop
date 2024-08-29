import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import img from "../../image/defaultProfile.jpg";
import moment from "moment";
import { Trash, FilePenLine, X } from "lucide-react";
import AdminMenu from "./AdminMenu";

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
        const res = await deleteUser(id);
        if (res.error) {
          addtoast("error", res.error.data.message);
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
        isAdmin: role === "Admin",
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
    <div className="h-screen ml-10 flex justify-center items-center bg-[#292B4B] overflow-y-auto">
      <div className="relative mb-10">
        <AdminMenu />
      </div>
      <section className="w-[85%] bg-[#1B1C30] shadow-xl p-[2rem] text-center rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-white lg:mt-0 mb-4">
          Users <span className="text-[#7303c0]">Details</span>
        </h1>
        <p className="text-xl text-slate-200 -mt-4 mb-6">
          Total Users:{" "}
          <span className="text-[#7303c0]">{users ? users.length : 0}</span>
        </p>

        <div className="flex lg:justify-between items-center lg:flex-row flex-col">
          {/* Table */}
          <div className="w-full mt-4 max-h-[40vh] lg:max-h-[60vh] overflow-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="sticky top-0 bg-[#2A2C4A] z-10">
                <tr>
                  <th className="text-white font-bold text-xl">ID</th>
                  <th className="text-white font-bold text-xl">Avatar</th>
                  <th className="text-white font-bold text-xl">Username</th>
                  <th className="text-white font-bold text-xl">Email</th>
                  <th className="text-white font-bold text-xl">Role</th>
                  <th className="text-white font-bold text-xl">Since</th>
                  <th className="text-white font-bold text-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user._id} className="bg-[#24253C] hover:bg-[#292B4B]">
                      <td className="text-white text-center p-3">
                        {user._id ? user._id.slice(-8) : user._id}
                      </td>
                      <td className="text-center">
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
                          className="w-12 h-12 rounded-lg mx-auto"
                        />
                      </td>
                      <td className="text-white text-center p-3">
                        {user.username}
                      </td>
                      <td className="text-white text-center p-3">
                        {user.email}
                      </td>
                      <td className="text-white text-center p-3">
                        {user.isAdmin ? "Admin" : "User"}
                      </td>
                      <td className="text-white text-center p-3">
                        {user.createdAt
                          ? moment(user.createdAt).format("YYYY-MM-DD")
                          : user.createdAt}
                      </td>
                      <td className="text-center p-3">
                        <button onClick={() => deleteUserHandler(user._id)}>
                          <Trash color="#7303c0" size={24} />
                        </button>
                        <button
                          onClick={() => userClickHandler(user)}
                          className="ml-3"
                        >
                          <FilePenLine color="#7303c0" size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* User Profile Modal */}
          {showProfile && selectedUser && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-[#1B1C30] p-8 rounded-2xl shadow-lg w-[30rem]">
                <button
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#7303c0]"
                  onClick={handleCloseProfile}
                >
                  <X color="white" />
                </button>

                <div className="flex flex-col items-center">
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
                    className="w-20 h-20 mb-4 rounded-full"
                  />
                  <p className="text-white font-serif text-lg">
                    {selectedUser.username}
                  </p>
                  <p className="text-[#7303c0] font-serif text-sm mb-6">
                    {selectedUser.isAdmin ? "Administrator" : "User"}
                  </p>

                  <label className="w-full mb-4">
                    <span className="text-white font-serif text-lg">Username</span>
                    <input
                      type="text"
                      className="w-full mt-2 px-3 py-2 bg-[#292B4B] rounded-lg text-white"
                      value={editableUserName}
                      onChange={(e) => setEditableUserName(e.target.value)}
                    />
                  </label>

                  <label className="w-full mb-4">
                    <span className="text-white font-serif text-lg">Email</span>
                    <input
                      type="email"
                      className="w-full mt-2 px-3 py-2 bg-[#292B4B] rounded-lg text-white"
                      value={editableUserEmail}
                      onChange={(e) => setEditableUserEmail(e.target.value)}
                    />
                  </label>

                  <label className="w-full mb-6">
                    <span className="text-white font-serif text-lg">Role</span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-[#292B4B] rounded-lg text-white"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </label>

                  <button
                    disabled={isUpdating}
                    onClick={updateHandler}
                    className="w-full py-2 bg-[#7303c0] text-white rounded-lg hover:bg-purple-800"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                  {isUpdating && (
                    <div className="mt-4">
                      <Loader />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserList;
