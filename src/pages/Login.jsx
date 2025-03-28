import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Login({ setToken }) {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((user) => ({ ...user, [name]: value }))
    };

    const handleLogin = async () => {
        setLoading(true);
        await axios.post("https://reqres.in/api/login", userData)
        .then((res) => {
            localStorage.setItem("session-token", res.data.token);
            setToken(res.data.token); 
            setLoading(false);
            navigate("/");
        })
        .catch((e) => console.log(e))
    }

    return (
        <div className="w-[100vw] h-[100vh] flex">
            <div className="m-auto sm:w-[90%] md:w-[60%] lg:w-[30%] sm:h-[70%] lg:h-[50%] border-[1.3px] flex flex-col">
                <div className="h-[20%] bg-amber-400">
                    <p className="mx-3 my-3 text-3xl font-semibold">Login</p>
                </div>
                <div className="h-[80%] w-[100%] py-3 flex flex-col justify-center items-center gap-5">
                    <div className="px-2 py-2 sm:w-[90%] lg:w-[85%] border-[1px]">
                        <input 
                        type="email" 
                        name="email"
                        value={userData.email}
                        className="outline-none border-none w-[100%]"
                        onChange={handleChange}
                        placeholder="Enter your email"
                        />
                    </div>
                    <div className="px-2 py-2 sm:w-[90%] lg:w-[85%] border-[1px] ">
                        <input 
                        type="password" 
                        name="password"
                        value={userData.password}
                        className="outline-none border-none w-[100%]"
                        onChange={handleChange}
                        placeholder="Enter your password"
                        />
                    </div>
                    <button
                    className="px-5 py-2 rounded-full bg-green-400 text-white  enabled:hover:bg-green-600 enabled:cursor-pointer"
                    disabled={!userData.email || !userData.password || loading}
                    onClick={handleLogin}
                    >{loading ? "Logging in ..." : "Login"}</button>
                </div>
            </div>
        </div>
    );
};