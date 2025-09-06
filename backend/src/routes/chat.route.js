import express from "express"
import { protectedRoute } from "../auth.middleware.js";
import {getStreamToken} from "../controllers/chat.controller.js"

const route = express.Router();

route.get("/token", protectedRoute, getStreamToken) 

export default route;