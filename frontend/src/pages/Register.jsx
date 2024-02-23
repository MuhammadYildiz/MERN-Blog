
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";


export default function Register() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const handleRegister = async (e) => {
        e.preventDefault()
        if (!userName || !password) {
            alert("Please complete inputs")
            return
        }
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            body: JSON.stringify({ userName, password }),
            headers: { "Content-Type": "application/json" }
        })
        if (response.status === 200) {
            /* alert("Register successful") */
            navigate("/login")
        }
        else {
            alert("Register Filed")
        }
    }
    return (
        <div className="w-full h-[90dvh] flex justify-center items-center pt-10">
            <form onSubmit={handleRegister} className="flex flex-col text-center shadow-2xl shadow-sky-900 h-[350px] justify-around p-10 rounded-lg w-[350px] ">
                <h1 className="text-xl font-bold uppercase ">Register</h1>
                <input type="text" placeholder="User Name:" value={userName} onChange={(e) => setUserName(e.target.value)} className="outline-none border-2 border-sky-800 px-2 py-1 rounded-md" />
                <input type="password" autoComplete="" placeholder="Password:" value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none border-2 border-sky-800 px-2 py-1 rounded-md" />
                <button type="submit" className="bg-sky-800 rounded-md text-white px-3 py-2 hover:bg-sky-600">Register</button>
                <p>Have an account ?  <NavLink to={"/login"} className={"text-red-600 hover:underline"}>Login</NavLink> </p>
            </form>
        </div>
    )
}

