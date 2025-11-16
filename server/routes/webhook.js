const express = require("express");
const axios = require("axios");
const config = require("../config");
const { extractActionItems } = require("../utils");
const { sendEvent } = require("../events");

const router = express.Router();

router.post("/status_change", async (req, res) => {
  console.log("Received webhook:", JSON.stringify(req.body, null, 2));

  const { data } = req.body || {};

  res.status(200).send("OK");

  if (!data || !data.status || data.status.code !== "done") {
    return;
  }

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

    if (!transcript || transcript.length === 0) {
      sendEvent({ error: "No transcript found" });
      return;
    }

    const actionItems = await extractActionItems(JSON.stringify(transcript));
    sendEvent(actionItems);
  } catch (error) {
    console.error(error);
    sendEvent({ error: "Error extracting action items" });
  }
});

module.exports = router;
