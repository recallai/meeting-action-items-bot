const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["RECALL_API_KEY", "RECALL_REGION", "OPENAI_API_KEY", "GEMINI_API_KEY"];

const validateEnvVars = (vars) => {
  const missingVars = vars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

validateEnvVars(requiredEnvVars);

module.exports = {
  recallApiKey: process.env.RECALL_API_KEY,
  recallRegion: process.env.RECALL_REGION,
  openAiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY
};
