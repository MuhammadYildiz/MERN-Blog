const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const User = require("./models/userModel");
const Blog = require("./models/blogModel");

const app = express();
const salt = bcrypt.genSaltSync(10);
/* app.use("/uploads",express.static(__dirname + '/uploads')) */
app.use('/uploads', express.static('uploads'));
/* Middleware */
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(cookieParser());

/* Register and create user */
app.post("/register", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.create({ userName, password: bcrypt.hashSync(password, salt) });
        return res.status(200).json({ message: "Register Successful!", user });
    } catch (error) {
        return res.status(500).json({ message: "Register failed!", error });
    }
});

/* User login */
app.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const passOk = bcrypt.compareSync(password, user.password);
        if (passOk) {
            jwt.sign({ userName, id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1hr" }, (error, token) => {
                if (error) throw error;
                res.cookie("token", token).json({
                    id: user._id,
                    userName,
                    message: "Login Successful!"
                });
            });
        } else {
            return res.status(400).json({ message: "Invalid password!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Login failed!", error });
    }
});

/* get profile */
app.get("/profile", (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        return res.json(info);
    });
});

/* Logout */
app.post("/logout", (req, res) => {
    return res.cookie("token", "").json("OK");
});

/* Create and post blog */
const upload = multer({ dest: 'uploads/' });
app.post('/postBlog', upload.single('file'), async (req, res) => {
    const { token } = req.cookies;
    const file = req.file;
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const { id: authorId } = decodedToken;
        const postBlog = await Blog.create({
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            cover: file.filename,
            author: authorId
        });

        res.status(201).json({ message: 'Post created successfully', postBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

/* Get blogs */
app.get("/getBlogs", async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate('author', ['userName']);
        res.status(200).json({ message: 'Get blogs successfully', blogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
/* Get Single Blog */
app.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Blog.findById(id).populate("author", ['userName']);
        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});
/* Edit single blog */
app.put('/postBlog', upload.single('file'), async (req, res) => {
    const { token } = req.cookies;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'File not provided' });
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const updatedBlog = await Blog.findById(id);
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const itAuthor = JSON.stringify(updatedBlog.author) == JSON.stringify(info.id);
        if (!itAuthor) {
            return res.status(403).json({ message: 'Invalid author' });
        }
        await updatedBlog.updatedAt({ title, summary, content });
        // Now you can safely access properties of updatedBlog
        res.status(201).json({ message: 'Post updated successfully', updatedBlog });
    });

})

mongoose.connect(process.env.MongoDB_URL)
    .then(() => {
        console.log("Project connected with MongoDB database");
        app.listen(process.env.PORT, () => {
            console.log("Project working on port " + process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
