import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"
import { format } from "date-fns";
export default function Layout() {
    const [blogs, setBlogs] = useState([])
    useEffect(() => {
        fetch("http://localhost:5000/getBlogs")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(blogPosts => {
                setBlogs(blogPosts.blogs);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, []);

    return (
        <div className="pt-32 md:p-36">
            {blogs.length > 0 && blogs.map((blog) => (
                <NavLink to={`/post/${blog._id}`} key={blog._id} className="w-full p-5  flex flex-col gap-3 justify-center items-center border-b ">
                    <div className="lg:flex w-full gap-5 ">
                        <img src={`http://localhost:5000/uploads/${blog.cover}`} alt="" className="w-[400px] h-[250px]" />
                        <div>
                            <h2 className="text-xl font-bold mb-3 my-3 lg:my-0">{blog.title}</h2>
                            <div className="flex w-full justify-start my-2 *:mr-3">
                                By
                                <p href="" className="bg-gray-500 px-2 text-white mx-2">
                                    {blog.author.userName}
                                </p>
                                {blog.createdAt && (
                                    <p>{format(new Date(blog.createdAt), 'MMM d, yyyy, HH:mm')}</p>
                                )}
                            </div>
                            <p>{blog.content} </p>
                            <p>{blog.summary}</p>
                        </div>
                    </div>
                </NavLink>
            )
            )}
        </div>
    )
}
