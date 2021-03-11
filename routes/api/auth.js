const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const route = express.Router();

// @route   GET  api/auth
// @dest    Get User by Id
// @access  Private
route.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/auth
// @dest    Login User
// @access  Public
route.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // Validator input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      
      if (!user) {
        return res.status(400).json([{ errors: "Invalid Credentials" }]);
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json([{ errors: "Invalid Credentials" }]);
      }     

      // jwt create
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {      
      res.status(500).send("Server Error");
    }
  }
);
module.exports = route;
