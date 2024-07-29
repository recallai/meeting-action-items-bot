const express = require("express");
const axios = require("axios");
const config = require("../config");
const { extractActionItems } = require("../utils");
const { sendEvent } = require("../events");

const router = express.Router();

router.post("/status_change", async (req, res) => {
  const { data } = req.body;

  res.status(200).send("OK");

  // extract action items when meeting is over
  if (data.status.code === "done") {
    try {
      const transcriptResponse = await axios.get(
        `https://${config.recallRegion}.recall.ai/api/v1/bot/${data.bot_id}/transcript`,
        {
          headers: {
            Authorization: `Token ${config.recallApiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const transcript = transcriptResponse.data;

      // error handling for empty transcript
      if (transcript.length === 0) {
        sendEvent({ error: "No transcript found" });
        return;
      }
      const actionItems = await extractActionItems(JSON.stringify(transcript));
      sendEvent(actionItems);
    } catch (error) {
      console.error(error);
      sendEvent({ error: "Error extracting action items" });
    }
  }
});

module.exports = router;
