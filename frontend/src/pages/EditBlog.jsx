import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBlog() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/post/${id}`);
                if (response.ok) {
                    const postInfo = await response.json();
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content);
                    id
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };
    const updatePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("summary", summary);
        formData.append("content", content);
        formData.append("file", file)
        const response = await fetch("http://localhost:5000/postBlog", {
            method: "PUT",
            body: formData,
            credentials: "include",
            /* headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
 */
        });
        if (response.ok) {
            navigate("/post/" + id)
        }
        if (!response.ok) {
            console.error('Failed to update blog:', response.statusText);
            // Add more detailed error handling here
        }


        // Add the logic to update the post using the form data
    };

    return (
        <div className="pt-20 w-full h-[90vh] flex justify-center items-center">
            <form
                onSubmit={updatePost}
                className="shadow-sky-900 shadow-2xl flex flex-col h-[600px] w-[500px] text-center justify-around p-10"
            >
                <h1 className="text-xl font-bold uppercase">Edit Blog</h1>
                <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                />
                <input
                    type="text"
                    name="content"
                    placeholder="Blog Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                />
                <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="cursor-pointer"
                />
                <textarea
                    name="summary"
                    placeholder="Blog Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                ></textarea>
                <button type="submit" className="bg-sky-900 py-1 text-white font-bold rounded-md">
                    Update
                </button>
            </form>
        </div>
    );
}
