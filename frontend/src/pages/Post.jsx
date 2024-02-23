import { useState } from "react"
import { useNavigate } from "react-router-dom";
export default function Post() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);  // Use null instead of an empty string for file state
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFile(e.target.files[0])
    }
    const handlePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("summary", summary);
        formData.append("content", content);
        formData.append("file", file)
        const response = await fetch("http://localhost:5000/postBlog", {
            method: "POST",
            body: formData,
            credentials:"include"
        });
        if (response.ok) {
            navigate("/layout")
        }
    };
    return (
        <div className="pt-20 w-full h-[90dvh] flex justify-center items-center">
            <form onSubmit={handlePost} className="shadow-sky-900 shadow-2xl flex flex-col h-[600px] w-[500px] text-center justify-around p-10">
                <h1 className="text-xl font-bold uppercase">Post Blog</h1>
                <input type="title" name="" id="" placeholder="Blog Title:" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                />
                <input type="text" name="" id="" placeholder="Blog Content:"
                    value={content} onChange={(e) => setContent(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                />
                <input type="file" name="" id="" onChange={handleChange}
                    className="cursor-pointer"
                />
                <textarea name="" id="" cols="30" rows="10" placeholder="Blog Summary:"
                    value={summary} onChange={(e) => setSummary(e.target.value)}
                    className="outline-none border-2 border-sky-900 rounded-md px-3 py-1"
                ></textarea>
                <button type="submit" className="bg-sky-900 py-1 text-white font-bold rounded-md">Sent Post</button>
            </form>
        </div>
    )
}
