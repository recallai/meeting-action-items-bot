const { GoogleGenAI } = require("@google/genai");
const config = require("./config");

// ✅ Initialize Gemini client (API key comes from env or config)
const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY,
});

/**
 * Extracts action items from a meeting transcript (Gemini version)
 * @param {string} meetingTranscript - The full transcript text
 * @returns {Promise<Array>} - Array of participants and their action items
 */
const extractActionItems = async (meetingTranscript) => {
  console.log("Transcript Passed to GEMINI:", meetingTranscript);
  const prompt = `
    You are an assistant that analyzes meeting transcripts and extracts action items.
    - Identify each participant by name (if available).
    - Extract at least one action item per participant.
    - Action items must be short, clear, and task-focused.
    - Respond ONLY in valid JSON matching the schema below.

    Transcript:
    ${meetingTranscript}

    Output format:
    {
      "meeting_data": [
        {
          "user": "participant name",
          "action_items": ["action item 1", "action item 2"]
        }
      ]
    }
  `;

  try {
    // ✅ Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or gemini-1.5-pro
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // disables extra "thinking" tokens
      },
    });

    var content = response.text; // raw output as string
    console.log("Gemini API response:", content);
    content = content.replace(/```json|```/g, "").trim();
    let data = {};
    try {
      data = JSON.parse(content);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", content);
      throw err;
    }

    return data.meeting_data;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw error;
  }
};

module.exports = { extractActionItems };
