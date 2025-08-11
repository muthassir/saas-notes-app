const express = require("express");
const router = express.Router();
const Message = require("../models/Message.js");

router.post("/", async (req, res) => {
  try {
    const { wa_id, name, from, to, text } = req.body;
    const doc = {
      payload_type: "app_sent",
      wa_id: wa_id || null,
      name: name || null,
      from: from || null,
      to: to || null,
      message_id: `local-${Date.now()}`,
      text: text || "",
      timestamp: String(Math.floor(Date.now() / 1000)),
      status: "sent",
    };
    const created = await Message.create(doc);
    res.json({ ok: true, doc: created });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
