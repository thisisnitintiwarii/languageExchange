import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export async function signup(req, res) {

    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // if already exists


        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(400).json({ message: "Email already Exists" });

        }


        //choose avatar

        const idx = Math.floor(Math.random() * 100) + 1; // generate a random number between 1 - 100

        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        // create a User

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePick: randomAvatar,
        });

        //create JWT token 
        // create the user in stream as well 

        const token = jwt.sign({
            userId: newUser._id, // payload
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({
            success: true,
            user: newUser,
            message: "User created SuccessFully"
        })

    } catch (error) {
        console.log("Error in signup controller");

        res.status(201).json({
            message: "Internal server error"
        })
    }
}

export async function login(req, res) {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All credintials are required"
            })
        }

        console.log(email);

        const user = await User.findOne({ email });

        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Password or email does not matched"
            })
        }


        const token = jwt.sign({
            userId: user._id, // payload
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            success: true, user
        })

    } catch (error) {
        console.log("error in login controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({
        success: true,
        message: "LogOut SuccessFully"
    })
}