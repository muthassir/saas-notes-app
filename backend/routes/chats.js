const express = require("express");
const router = express.Router();
const Message = require("../models/Message.js");

router.get("/", async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$wa_id", lastMessage: { $first: "$$ROOT" }, count: { $sum: 1 } } },
      { $sort: { "lastMessage.timestamp": -1 } },
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
