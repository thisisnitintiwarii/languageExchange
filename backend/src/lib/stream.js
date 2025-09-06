import { StreamChat } from "stream-chat"

import "dotenv/config.js"

const apikey = process.env.STREAM_API_KEY
const apisecret = process.env.STREAM_API_SECRET

if (!apikey || !apisecret) {
    console.log("Stream API key or Secret Key is missing")
}

const streamClient = StreamChat.getInstance(apikey, apisecret);


//function to create a user in streamchat
export const upsertStreamUser = async (userData) => {

    try {
        await streamClient.upsertUsers([userData]);
        return userData;

    } catch (error) {
        console.log("Errorr upsert creating Stream user")
    }
};

export const generateStreamToken = (userId) => {
    try {
        //ensure user id is a string

        const userIdStr = userId.toString();

        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("Error generting the strema token", error.message)
    }
};