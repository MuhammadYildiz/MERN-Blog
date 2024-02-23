import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Layout from "./pages/Layout"
import Post from "./pages/Post"
import { UserContextProvider } from "./UserContext"
import SingleBlog from "./pages/SingleBlog"
import EditBlog from "./pages/EditBlog"
function App() {
    return (
        <>
            < UserContextProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/layout" element={<Layout />} />
                        <Route path="/post" element={<Post />} />
                        <Route path="/post/:id" element={<SingleBlog/>} />
                        <Route path="/edit/:id" element={<EditBlog/>} />
                    </Routes>
                </BrowserRouter></UserContextProvider>
        </>
    )
}

export default App
