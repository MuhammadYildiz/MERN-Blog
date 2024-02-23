import { useContext, useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
export default function SinglepostInfo() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext)
    const { id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:5000/post/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPostInfo(data);
            })
            .catch((error) => {
                console.error("Error fetching postInfo post:", error);
            });
    }, [id]);

    if (!postInfo) return ""
    return <div className="pt-20 sm:p-20">
        {postInfo && (
            <div key={postInfo._id} className="w-full p-5  flex flex-col gap-3 justify-center items-center border-b ">
                <div className="w-full">
                    <NavLink to={"/"} className={"  bg-sky-900 text-white  px-3 py-1 rounded-l-full"}>Back To Home<i className="fa-solid fa-backward"></i>  </NavLink>
                </div>
                <div className="flex flex-col items-start w-full gap-5 ">
                    <h2 className="text-3xl font-bold mb-3 text-center my-3 w-full">{postInfo.title}</h2>
                    {postInfo.createdAt && (
                        <p className="w-full text-center text-gray-500">{format(new Date(postInfo.createdAt), 'MMM d, yyyy, HH:mm')}</p>
                    )}
                    <div className="flex w-full justify-center text-center">
                        <span>By @</span>
                        <p href="" className="bg-gray-200 rounded-sm text-black px-2 ">
                            {postInfo.author.userName}
                        </p>
                    </div>
                    {userInfo.id === postInfo.author._id &&
                        <div className="w-full text-center *:m-2 *:p-2 *:px-3 *:bg-gray-600 *:text-white *:rounded-md *cursor-cursor-pointer *:text-center">
                            <NavLink to={`/edit/${postInfo._id}`}>
                                <i className="fa-solid fa-pen-to-square hover:text-blue-500"></i> </NavLink>
                            <button><i className="fa-solid fa-trash hover:text-red-600"></i></button>
                        </div>
                    }
                    <img src={`http://localhost:5000/uploads/${postInfo.cover}`} alt="" className="w-full " />
                    <div>

                        <div className="flex w-full justify-start my-2 *:mr-3">
                            <p>{postInfo.content} </p>
                        </div>
                        <p>{postInfo.summary}</p>
                    </div>
                </div>
            </div>
        )
        }
    </div>;
}
