import { useContext, useEffect, } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function Navbar() {
    const navigate = useNavigate()
    const { setUserInfo, userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch("http://localhost:5000/profile", {
            credentials: "include",
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
            })
        })
    }, [])
    const handleLogout = () => {
        fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                setUserInfo("")
                navigate("/login")
            });

    };
    const userName = userInfo?.userName
    return (
        <div className="bg-sky-950  flex justify-between md:justify-around w-full items-center text-white fixed">
            <NavLink to={"/"}> <h1 className="text-3xl font-bold uppercase p-5 ">Blog APP</h1> </NavLink>
            {userName ?
                <div className="flex  justify-between items-center lg:w-[42%] ">
                    <div className="*:mx-3 *:border border-white *:px-3 *:py-2 *:rounded-lg" >
                        {/* <NavLink to={"/layout"} className={"[&.active]:border-red-600"}>My Blog</NavLink> */}
                        <NavLink to={"/post"} className={"[&.active]:border-red-600"}>Post Blog</NavLink>
                    </div>
                    <div className="flex items-center">
                        <NavLink onClick={handleLogout}
                            className=" text-red-600 hover:text-white border hover:border-red-600 px-2 py-1 rounded-lg">
                            Logout
                        </NavLink>
                        <p className="mx-2">{userName} </p>
                    </div>
                </div> :
                <div className="*:mx-3 *:border border-white *:px-3 *:py-2 *:rounded-lg" >
                    <NavLink to={"/login"} className={"[&.active]:border-red-600"}>Login</NavLink>
                    <NavLink to={"/register"} className={"[&.active]:border-red-600"}>Register</NavLink>
                </div>}
        </div>
    )
}
