require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const webhookRoutes = require("./routes/webhook.js");
const messagesRoutes = require("./routes/messages.js");
const chatsRoutes = require("./routes/chats.js");
const sendRoutes = require("./routes/send.js");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ->", MONGO_URI))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/webhook", webhookRoutes);
app.use("/messages", messagesRoutes);
app.use("/chats", chatsRoutes);
app.use("/send", sendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
