import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUdateUserMutation,
} from "../../redux/api/usersApiSlice";
import img from "../../image/img1.jpg";
import moment from "moment";
import { Trash,FilePenLine } from "lucide-react";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUdateUserMutation();

  const [showProfile, setShowProfile] = useState(false);
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch, users]);

  return (
    <div className=" h-screen flex justify-center items-center bg-[#292B4B]">
      <section
        className="
    relative ml-14 h-full max-h-[58rem] bg-[#1B1C30] rounded-3xl shadow-xl p-8 flex flex-col items-center space-y-4 "
      >
        <h1 className=" relative  text-4xl font-serif font-bold text-white py-5 ">
          Users <span className="text-[#7303c0]">Details</span>
        </h1>
        <p className="absolute right-20 text-xl text-slate-200 ">
          Total Users: <span className="text-[#7303c0]">{users ? users.length : 0}</span> 
        </p>
        <div className=" flex items-center  space-x-4">
          <div
            className={`${
              showProfile ? "h-[46rem] w-[80rem]" : "h-[29rem] w-[104rem]"
            } border-2 flex items-center rounded-xl pl-16`}
          >
            <table className="w-full md:4/5 mx-auto">
              <thead>
                <tr>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    id
                  </th>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    Avatar
                  </th>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    Username
                  </th>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    Email
                  </th>
                  <th className={` ${showProfile ? "hidden":"flex"} text-white font-semibold text-left font-serif text-xl`}>
                    Operation
                  </th>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    Role
                  </th>
                  <th className=" text-white font-semibold text-left font-serif text-xl">
                    Since
                  </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="text-white">
                        {user._id ? user._id.slice(-8) : user._id}
                      </td>
                      <td className="text-white">
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
                          className="w-10 h-10 rounded-lg"
                        />
                      </td>
                      <td className="text-white">{user.username}</td>
                      <td className="text-white">{user.email}</td>
                      <td className={`${showProfile ? "hidden":"flex"} text-white`}>
                          <div className="w-full flex space-x-5">
                            <button onClick={() => deleteUser(user.id)}>
                          <Trash color="#7303c0"/>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfile(true);
                          }}
                        >
                        <FilePenLine color="#7303c0"/>
                        </button>
                          </div>
                        
                      </td>
                      <td className="text-white">
                        {user.isAdmin ? "Admin" : "User"}
                      </td>
                      <td className="text-white">
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
              showProfile ? "flex" : "hidden"
            } h-[29rem] border-2 w-[29rem]`}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default UserList;
