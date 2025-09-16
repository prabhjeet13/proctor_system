const express = require('express');
const { createUser, checkUser } = require('../controllers/User');
const userRouter = express.Router();

userRouter.post("/create/user",createUser);
userRouter.post("/check/user",checkUser);

module.exports = userRouter;