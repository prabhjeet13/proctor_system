const express = require('express');
const { sentInvite, completeInterview, getAllInterviews, start_interview, getInterviewData } = require('../controllers/interview');
const intRouter = express.Router();

intRouter.post("/send/invite",sentInvite); 

intRouter.post("/get/all/interviews",getAllInterviews);

intRouter.post("/get/interviewlogs",getInterviewData);

intRouter.post("/complete/Interview",completeInterview);

intRouter.post("/start/Interview",start_interview);

module.exports = intRouter;