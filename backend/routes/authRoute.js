const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");

const parseDOB = (dob) => {
    if (typeof dob === "string" && dob.includes("/")) {
        const [day, month, year] = dob.split("/");
        return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dob);
};

router.post("/signup", async (req, res) => {
    try {
        const { name, dob, location, email, password, govtImage, selfieImage, blockchainAddress, coordinates } = req.body;

        if (!name || !dob || !email || !password || !govtImage || !selfieImage) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered." });
        }

        const newUser = new User({
            name,
            dob: parseDOB(dob),
            location,
            email,
            password,
            govtImage: Buffer.from(govtImage, "base64"),
            selfieImage: Buffer.from(selfieImage, "base64"),
            blockchainAddress,
            coordinates,
        });

        await newUser.save();
        
        req.session.userId = newUser._id;
        
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
        };
        
        res.status(201).json({ message: "User registered successfully.", user: userResponse });
    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ error: "Signup failed." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required." });
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        req.session.userId = user._id;
        
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        };

        res.status(200).json({ message: "Login successful", user: userResponse });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Login failed." });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully." });
    });
});

router.get("/check-session", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated." });
    }

    try {
        const user = await User.findById(req.session.userId).select('-password -govtImage -selfieImage');
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json(user);

    } catch (err) {
        console.error("❌ Session check failed:", err);
        res.status(500).json({ message: "Server error during session check." });
    }
});

module.exports = router;