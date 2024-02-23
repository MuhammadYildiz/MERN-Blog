
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function Login() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    /* const [reDirect, setReDirect] = useState(false) */
    const { setUserInfo } = useContext(UserContext)
    const handleLogin = async (e) => {
        e.preventDefault()
        if (!userName || !password) {
            alert("Please complete inputs")
            return
        }
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            body: JSON.stringify({ userName, password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
        if (response.status === 200) {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                /* setReDirect(true) */
            })
            navigate("/")
            window.location.reload();
        }
        else {
            alert("Invalid credentials")
        }
    }
    return (
        <div className="w-full h-[90dvh] flex justify-center items-center pt-10">
            <form onSubmit={handleLogin} className="flex flex-col text-center shadow-2xl shadow-sky-900 h-[350px] w-[350px] justify-around p-10 rounded-lg">
                <h1 className="text-xl font-bold uppercase ">Login</h1>
                <input type="text" placeholder="User Name:" value={userName} onChange={(e) => setUserName(e.target.value)} className="outline-none border-2 border-sky-800 px-2 py-1 rounded-md" />
                <input type="password" autoComplete="" placeholder="Password:" value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none border-2 border-sky-800 px-2 py-1 rounded-md" />
                <button type="submit" className="bg-sky-800 rounded-md text-white px-3 py-2 hover:bg-sky-600">Login</button>
                <p>Not have an account ?  <NavLink to={"/register"} className={"text-red-600 hover:underline"}>Register</NavLink> </p>
            </form>
        </div>
    )
}
