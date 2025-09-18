const express = require('express');
const { sentInvite, completeInterview, getAllInterviews, start_interview, getInterviewData } = require('../controllers/interview');
const intRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 

intRouter.post("/send/invite",sentInvite); 

intRouter.post("/get/all/interviews",getAllInterviews);

intRouter.post("/get/interviewlogs",getInterviewData);

intRouter.post("/complete/Interview",upload.single("video"),completeInterview);

intRouter.post("/start/Interview",start_interview);

module.exports = intRouter;