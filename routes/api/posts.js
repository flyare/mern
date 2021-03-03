const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const Post = require("../../models/Post");
const mongoose = require("mongoose");
const e = require("express");

const route = express.Router();

// @route   Post  api/posts
// @dest    Add Post
// @access  Private
route.post(
    "/",
    [
        auth,
        check("text", "Text is required.").not().isEmpty(),
        check("title", "Title is required.").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            const newPost = new Post({
                text: req.body.text,
                title: req.body.title,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();

            res.json({ post });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ msg: "Server Error." });
        }
    }
);

// @route   Get  api/posts
// @dest    Get all posts
// @access  Private
route.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ date: -1 });
        res.json({ posts });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   Get  api/posts/id
// @dest    Get post by id
// @access  Private
route.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   Delete  api/posts/id
// @dest    Delete post by id
// @access  Private
route.delete("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: "User not authorized!" });
        }

        await post.remove();
        res.json({ msg: "Post removed!" });
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   PUT  api/posts/likes/id
// @dest    Like a post
// @access  Private
route.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (
            post.likes.filter((likes) => likes.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "Post already liked." });
        }

        post.likes.unshift({ user: mongoose.Types.ObjectId(req.user.id) });

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   PUT  api/posts/unlikes/id
// @dest    Unlike a post
// @access  Private
route.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (
            post.likes.filter((likes) => likes.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Post not yet been liked." });
        }

        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   Post  api/posts/comment/id
// @dest    Add comment to a Post
// @access  Private
route.post(
    "/comment/:id",
    [auth, check("text", "Text is required.").not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Post.findById(req.params.id);
            const postComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(postComment);

            await post.save();

            res.json({ post });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ msg: "Server Error." });
        }
    }
);

module.exports = route;
