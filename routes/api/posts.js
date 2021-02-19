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
  [auth, check("text", "Text is required.").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
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
module.exports = route;
