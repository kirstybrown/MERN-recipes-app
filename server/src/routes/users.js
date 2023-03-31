import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const configJson = require("../../config.json");


const router = express.Router();


router.post("/register", async(req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({username});

    if (user) {
        return res.json({user});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save();

    res.json({message: "User Registered Successfully!"});
});

router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.json({ message: "User doesn't exist!"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.json({message: "Username or Password is incorrect!"});
    }

    const token = jwt.sign({ id: user._id }, configJson.USER_TOKEN_SECRET);

    res.json({ token, userID: user._id });

});


export { router as userRouter };