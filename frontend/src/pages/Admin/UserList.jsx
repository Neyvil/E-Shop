import React, { useState, useEffect } from "react";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { Trash2, Edit, X , User2Icon } from "lucide-react";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const addToast = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (error) {
      addToast("error", "Failed to fetch users. Please try again later.");
    }
  }, [error, addToast]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await deleteUser(id).unwrap();
        addToast("success", result.message || "User deleted successfully");
        refetch();
      } catch (err) {
        addToast("error", err.data?.message || "Error deleting user");
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      const result = await updateUser({
        userId: selectedUser._id,
        ...editForm,
      }).unwrap();
      addToast("success", `${result.username} updated successfully`);
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      addToast("error", err.data?.message || "Error updating user");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-300">Loading users...</div>;
  }

  return (
    <div className="p-6 bg-[#1e1f3b] min-h-screen">
      <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center"> User <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">
                  Management
                </span></h1>
      <div className=" m-auto lg:ml-32 bg-gray-800 rounded-lg shadow-lg overflow-x-auto lg:overflow-hidden">
        <table className="w-full divide-y bg-[#1B1C30] text-white">
          <thead className="bg-[#7303c0]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Username</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-750 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-full object-cover border-2 border-[#ff0066]"
                      src={
                        user.image
                          ? `https://e-shop-backend-ep6p.onrender.com/${user.image.replace(/\\/g, "/")}`
                          : "https://via.placeholder.com/48"
                      }
                      alt={user.username}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'superadmin'
                      ? 'bg-[#ff0066] text-white': user.role === 'admin'? 'bg-purple-200 text-purple-800'
                      : 'bg-green-800 text-white'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-pink-600 hover:text-pink-800 transition-colors duration-200 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-8 w-full max-w-md m-auto flex-col flex rounded-lg bg-gray-800 border border-gray-700 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">Edit User</h3>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              placeholder="Username"
              className="mb-4 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email"
              className="mb-4 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="mb-6 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {isUpdating ? "Updating..." : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;