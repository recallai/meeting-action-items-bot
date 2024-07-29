const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "RECALL_API_KEY",
  "RECALL_REGION",
  "RECALL_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
];

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
  recallWebhookSecret: process.env.RECALL_WEBHOOK_SECRET,
  openAiApiKey: process.env.OPENAI_API_KEY,
};