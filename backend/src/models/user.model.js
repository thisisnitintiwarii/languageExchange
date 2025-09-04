import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: "",
    },
    profilePick: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean, // if false means you have to fill the onboarded form 
        default: false, // if true means u can redirect to another pages
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
}, {
    timestamps: true
})



//pre Hook -> // hash the password  -> make this unreadble in DB
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();  // if user does not change pass dont hash

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(error);
    }
})
userSchema.methods.matchPassword = async function (enteredpassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredpassword, this.password);
    return isPasswordCorrect;
}


const User = mongoose.model("User", userSchema);

export default User;

