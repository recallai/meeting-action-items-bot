const express = require("express");
const axios = require("axios");
const config = require("../config");
const { extractActionItems } = require("../utils");
const { sendEvent } = require("../events");
const prompt = require('prompt-sync')();


const router = express.Router();

router.post("/status_change", async (req, res) => {
  const { data } = req.body;

  res.status(200).send("OK");
 
  // extract action items when meeting is over
  if (data.data && data.data.code === "done") {
    try {
      //meeting ended event
     

      // 1. Get bot info
      console.log("fetching bot info...");
      const botResponse = await axios.get(
        `https://${config.recallRegion}.recall.ai/api/v1/bot/${data.bot.id}`,
        {
          headers: {
            Authorization: `Token ${config.recallApiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const botInfo = botResponse.data;

      // 2. Get transcript id from botInfo
      const recordings = botInfo.recordings || [];
      if (!recordings.length || !recordings[0].media_shortcuts?.transcript?.id) {
        sendEvent({ error: "No transcript id found in bot info" });
        return;
      }
      const transcriptId = recordings[0].media_shortcuts.transcript.id;

      // 3. Fetch transcript using transcript id
      console.log("fetching transcript...");
      const transcriptResponse = await axios.get(
        `https://${config.recallRegion}.recall.ai/api/v1/transcript/${transcriptId}`,
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
      if (!transcript || !transcript.data || !transcript.data.download_url) {
        sendEvent({ error: "No transcript data found" });
        return;
      }

      // 4. Download the actual transcript JSON from the download_url
      const transcriptJsonResponse = await axios.get(transcript.data.download_url);
      const transcriptJson = transcriptJsonResponse.data;

      if (!transcriptJson || transcriptJson.length === 0) {
        sendEvent({ error: "No transcript found" });
        return;
      }

      const actionItems = await extractActionItems(JSON.stringify(transcriptJson));
      sendEvent(actionItems);
    } catch (error) {
      console.error(error);
      sendEvent({ error: "Error extracting action items" });
    }
  }


  
});

module.exports = router;
