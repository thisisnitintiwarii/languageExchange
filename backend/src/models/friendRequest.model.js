import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default:"pending",
        required: true
    }
}, {
    timestamps: true
})

const friendRequest = mongoose.model("friendRequest", friendRequestSchema);

export default friendRequest;