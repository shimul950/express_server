import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/users",userRouters)

//routes ==> controller ==> service

router.post("/",userControllers.createUser);

router.get("/", logger,auth("admin"), userControllers.getAllUser);

router.get("/:id",userControllers.getUser);

router.put("/:id",userControllers.updateUser);

router.delete("/:id",userControllers.deleteUser);

export const userRouter = router;