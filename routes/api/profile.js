const express = require("express");
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator/check");
const e = require("express");

const route = express.Router();

// @route   GET  api/profile/me
// @dest    Get current profile
// @access  Login required
route.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res
                .status(404)
                .json({ error: "There is no profile for this user." });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: "Server Error." });
    }
});

// @route   POST  api/profile
// @dest    POST Add or Update profile
// @access  Private
route.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required").not().isEmpty(),
            check("skills", "Skills is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(",")
                .map((skill) => skill.trim());
        }

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
            } else {
                // Create
                profile = new Profile(profileFields);
                await profile.save();
            }

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   GET  api/profile
// @dest    Get All Profile
// @access  Public
route.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find({}).populate("user", [
            "name",
            "avatar",
        ]);
        res.status(200).send(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET  api/profile/user/user_id
// @dest    Get Profile By User ID
// @access  Public
route.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);

        if (!profile) return res.status(400).send({ msg: "Profile not found" });

        res.status(200).send(profile);
    } catch (error) {
        console.error(error.message);

        if (error.kind == "ObjectId")
            return res.status(400).send({ msg: "Profile not found" });
        res.status(500).send("Server Error");
    }
});

// @route   Delete  api/profile
// @dest    Delete profile and User
// @access  Private
route.delete("/", auth, async (req, res) => {
    try {
        const session = await mongoose.startSession();

        await session.withTransaction(async () => {
            await Profile.findOneAndDelete({ user: req.user.id });
            // Remove user
            throw new Error("Oop!");
            await User.findOneAndDelete({ _id: req.user.id });
        });

        await session.endSession();

        res.status(200).send({ msg: "User deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT  api/profile/experience
// @dest    Add experience for user
// @access  Private
route.put(
    "/experience",
    [
        auth,
        check("title", "Title is required").not().isEmpty(),
        check("company", "Company is required").not().isEmpty(),
        check("from", "From is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ msg: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;
        const newEx = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newEx);
            await profile.save();
            res.send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE  api/profile/experience/exp_id
// @dest    Delete experience from profile
// @access  Private
route.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT  api/profile/Education
// @dest    Add Education for user
// @access  Private
route.put(
    "/education",
    [
        auth,
        check("school", "School is required").not().isEmpty(),
        check("degree", "Degree is required").not().isEmpty(),
        check("fieldofstudy", "Field of study is required").not().isEmpty(),
        check("from", "From is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ msg: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE  api/profile/education/edu_id
// @dest    Delete education from profile
// @access  Private
route.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.exp_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE  api/profile/github/:user_name
// @dest    Get user repos from GitHub
// @access  Public
route.get("/github/:username", (req, res) => {
    try {
        const option = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                "githubClientId"
            )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node-js" },
        };

        request(option, (err, response, body) => {
            if (err) {
                console.error(err);
                return;
            }

            if (response.statusCode !== 200) {
                return res
                    .status(400)
                    .send({ msg: "No GitHub profile not found" });
            }

            res.json(JSON.parse(body));
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
module.exports = route;
