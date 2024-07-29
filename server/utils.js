const config = require("./config");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const extractActionItems = async (meetingTranscript) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
            You will be provided with a meeting transcript. For each participant in the meeting, you must extract         
            at least one action item. Action items are short, concise statements that describe a task that needs to be completed.
            Format the output as a JSON array where each object represents a participant and their action items.
            Transcript:
            ${meetingTranscript}
            
            Output format:
            {
              meeting_data: [
                  {
                      "user": "participant name",
                      "action_items": ["action item 1", "action item 2", ...]
                  },
                  {
                      "user": "participant name",
                      "action_items": ["action item 1", "action item 2", ...]
                  },
                  ...
              ]
            }
         `,
      },
    ],
  });
  const data = JSON.parse(response.choices[0].message.content).meeting_data;
  return data;
};

module.exports = { extractActionItems };
