const express = require("express");
const axios = require("axios");
const config = require("../config");
const { eventsHandler } = require("../events");

const router = express.Router();

// SSE to return action items
router.get("/events", eventsHandler);

router.post("/invite_bot", async (req, res) => {
  const meetingUrl = req.body.meetingUrl;
  try {
    // dispatch a bot to the meeting URL above
    //
    //
    //
  } catch (error) {
    console.error("Failed to invite bot", error);
    const status = error.response?.status;
    const message = error.response?.data;
    res.status(400).send({ status: status, message: message });
  }
});

module.exports = router;
