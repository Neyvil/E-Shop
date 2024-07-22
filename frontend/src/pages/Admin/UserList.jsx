import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUdateUserMutation,
} from "../../redux/api/usersApiSlice";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUdateUserMutation();

  const [editableUserId, setEditableUserId]= useState(null)
  const [editableUserName,setEditableUserName]=useState('')
  const [editableUserEmail,setEditableUseEmail]=useState('')

  useEffect(()=>{
    refetch()
  },[refetch])


  return (
    <div className=" h-screen flex justify-center items-center bg-[#292B4B]">
    <section className=""></section>
    

    </div>
  );
};

export default UserList;
