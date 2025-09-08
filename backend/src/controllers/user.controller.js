import friendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    // query to get the random users
    const recommendedUsers = await User.find({
      $and: [
        {
          _id: { $ne: currentUserId },
        },
        {
          _id: { $nin: currentUser.friends },
        },
        {
          isOnboarded: true,
        },
      ],
    });

    // return the random users

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommended USer", error.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function getMyFriends(req, res) {
  try {
    const currentUserId = req.user.id;

    const user = await User.findById(currentUserId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilepic nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriend controller", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;

    //read the url using prams
    const { id: recipientId } = req.params; // renaming the url id to recipient id

    if (myId == recipientId) {
      return res.status(400).json({
        message: "You cannot send friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({
        message: "Recipient does not exists",
      });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await friendRequest.findOne({
      $or: [
        {
          sender: myId,
          recipient: recipientId,
        },
        {
          sender: recipientId,
          recipient: myId,
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already send friend request to recipient",
      });
    }

    const fRequest = friendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    return res.status(200).json(fRequest);
  } catch (error) {
    console.error("Error in sending friend Request", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    // id is the id of the friendRequest document

    const fRequest = await friendRequest.findById(requestId);

    if (!fRequest) {
      return res.status(400).json({
        message: "Friend Request not fount",
      });
    }

    if (fRequest.recipient.toString() !== req.user.id) {
      return res.status(400).json({
        message: "You are not authorized to accept the request",
      });
    }

    fRequest.status = "accepted";
    await fRequest.save();

    // update the friends list of both sender and recipient
    // addTOset add elemet to the array of friends if the value does not exists
    await User.findByIdAndUpdate(fRequest.sender, {
      $addToSet: { friends: fRequest.recipient },
    });

    await User.findByIdAndUpdate(fRequest.recipient, {
      $addToSet: { friends: fRequest.sender },
    });

    res.status(200).json({
      message: "Friend Request Accepted",
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await friendRequest
      .find({
        recipient: req.user.id,
        status: "pending",
      })
      .populate(
        "sender",
        "fullName profilepic nativeLanguage learningLanguage"
      );

    const acceptedReqs = await friendRequest
      .find({
        sender: req.user.id,
        status: "accepted",
      })
      .populate("recipient", "fullName profilepic ");

    res.status(200).json({
      incomingReqs,
      acceptedReqs,
    });
  } catch (error) {
    console.error("Error in getFriendRequests", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingReqs = await friendRequest
      .find({
        sender: req.user.id,
        status: "pending",
      })
      .populate(
        "recipient",
        "fullName profilepic nativeLanguage learningLanguage"
      );

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.error("Error in getOutgoingFriendReqs", error.message);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}
