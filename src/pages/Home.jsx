import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { LuChevronRight } from "react-icons/lu";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://reqres.in/api/users?page=${page}`)
        .then((res) => setUsers([...res.data.data]))
        .catch((e) => console.log(e));
    }, [page]);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleEditUser = () => {
        if (!selectedUser) return;
        axios.put(`https://reqres.in/api/users/${selectedUser.id}`, selectedUser)
        .then(() => {
            setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
            toast.success("User updated successfully!");
            setModalOpen(false);
        })
        .catch(() => toast.error("Failed to update user."));
    };

    const handleDeleteUser = (id) => {
        axios.delete(`https://reqres.in/api/users/${id}`)
        .then(() => {
            toast.success("Successfully deleted the user!");
            setUsers((prev) => prev.filter((p) => p.id !== id));
        })
        .catch(() => toast.error("Failed to delete the user."));
    };

    const handleLogout = () => {
        localStorage.removeItem("session-token");
        navigate("/login", { replace: true });
        window.location.reload(); 
    };

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center overflow-x-hidden">
            <div className="w-[100%] bg-amber-600 text-white flex justify-between px-4 py-3">
                <h1 className="text-3xl">Users List</h1>
                <button className="py-2 px-2 border-[1px] rounded cursor-pointer hover:bg-white hover:text-amber-400" onClick={handleLogout}>Logout</button>
            </div>
            <div className="mt-10 sm:px-2 sm:w-full lg:w-3/5 flex flex-col items-center gap-2">
                <div className="flex flex-wrap justify-center gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="border rounded-md h-50 w-48">
                            <div className="p-3 flex flex-col items-center">
                                <img src={user.avatar} alt="avatar" className="rounded-full w-20" />
                                <p className="mt-3 text-center font-mono">{user.first_name} {user.last_name}</p>
                            </div>
                            <div className="border-t flex">
                                <button className="w-1/2 border-r-[1px] p-2 hover:bg-gray-200" onClick={() => openEditModal(user)}>
                                    <MdModeEdit className="mx-auto" /> Edit
                                </button>
                                <button className="w-1/2 p-2 hover:bg-gray-200" onClick={() => handleDeleteUser(user.id)}>
                                    <MdDelete className="mx-auto" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="my-6 flex gap-2">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 bg-gray-200 rounded-full hover:bg-gray-400">
                        <IoIosArrowBack />
                    </button>
                    <p className="text-lg">{page}</p>
                    <button onClick={() => setPage(page + 1)} disabled={page === 2} className="p-2 bg-gray-200 rounded-full hover:bg-gray-400">
                        <LuChevronRight />
                    </button>
                </div>
            </div>
            {modalOpen && selectedUser && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-96 border-1 shadow">
                        <h2 className="text-xl mb-4">Edit User</h2>
                        <input 
                            type="text" 
                            className="border p-2 w-full mb-2" 
                            value={selectedUser.first_name} 
                            onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            className="border p-2 w-full mb-2" 
                            value={selectedUser.last_name} 
                            onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})} 
                        />
                        <div className="flex justify-end gap-2">
                            <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" onClick={handleEditUser}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer autoClose={3000} position="bottom-right" />
        </div>
    );
};
