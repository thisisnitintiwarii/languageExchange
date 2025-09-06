import express from "express"
import { protectedRoute } from "../auth.middleware.js";
import { getRecommendedUsers, getMyFriends, getFriendRequests, getOutgoingFriendReqs, sendFriendRequest, acceptFriendRequest } from "../controllers/user.controller.js"

const router = express.Router();

router.use(protectedRoute);// instead of applying protected route in each method use this fucntion as stated point

// apply auth middle layer to all routes

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);


// router.get("/friends", getMyFriends)
// router.get("/friends", getMyFriends)
// router.get("/friends", getMyFriends)

export default router;