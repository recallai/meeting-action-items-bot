let client = null;

const eventsHandler = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  client = res;

  req.on("close", () => {
    client = null;
  });
};

const sendEvent = (data) => {
  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};

module.exports = { eventsHandler, sendEvent };
