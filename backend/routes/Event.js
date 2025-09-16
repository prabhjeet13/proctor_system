const express = require('express');
const { createEvent } = require('../controllers/event');
const eventRouter = express.Router();

eventRouter.post("/create/event",createEvent);


module.exports = eventRouter;