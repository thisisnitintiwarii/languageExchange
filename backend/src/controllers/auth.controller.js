import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { upsertStreamUser } from "../lib/stream.js";

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
            profilepic: randomAvatar,
        });

        //create JWT token 
        // create the user in stream as well 

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilepic || "",
            })
            console.log("Creating Stream user ", newUser.fullName);

        } catch (error) {
            console.log("error while creating Stream user ", error)
        }

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

export async function onboard(req, res) {
    console.log(req.user);

    // create on board method
    try {
        const userId = req.user._id;


        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {

            return res.status(400).json({
                message: "All field are required",
                missingFeilds: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean) // only get the true values

            });
        }

        //updated the user onboarded detail
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, {
            new: true
        })



        if (!updatedUser) {
            return res.status(404).json({
                message: "User does not found"
            })
        }

        //TODO update the user info into Stream


        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilepic || ""
            })

            console.log(`steam user updated after oonboarding for &${updatedUser.fullName}`)
        } catch (streamError) {
            console.log(`Error while updating stream User after oonboarding ${streamError.message}`)
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        })


    } catch (error) {
        console.log("Onboarding Error")
        res.status(500).json({
            message: "Internal server Error"
        })
    }

}
