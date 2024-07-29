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
    const response = await axios.post(
      `https://${config.recallRegion}.recall.ai/api/v1/bot`,
      {
        bot_name: "ZoomBot",
        meeting_url: meetingUrl,
        transcription_options: {
          provider: "meeting_captions",
        },
      },
      {
        headers: {
          Authorization: `Token ${config.recallApiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Failed to invite bot", error);
    const status = error.response?.status;
    const message = error.response?.data;
    res.status(400).send({ status: status, message: message });
  }
});

module.exports = router;
