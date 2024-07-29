const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const webhookRoutes = require("./routes/webhook");

const app = express();

// enable all CORS requests for demo
app.use(cors());

app.use(bodyParser.json());

app.use("/api", apiRoutes);
app.use("/webhook", webhookRoutes);

app.listen(3000, () => console.log("Listening on port 3000."));
