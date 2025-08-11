const express = require("express");
const router = express.Router();

const {
  getChangesValue,
  upsertMessagesFromValue,
  applyStatusUpdatesFromValue,
} = require("../utils/messageHelpers.js");
const Message = require("../models/Message.js");

router.post("/", async (req, res) => {
  try {
    const obj = req.body;
    const value = getChangesValue(obj);

    if (value && Array.isArray(value.statuses) && value.statuses.length > 0) {
      const stats = await applyStatusUpdatesFromValue(obj, value);
      return res.json({ ok: true, action: "status_processed", stats });
    }

    if (value && Array.isArray(value.messages) && value.messages.length > 0) {
      const stats = await upsertMessagesFromValue(obj, value);
      return res.json({ ok: true, action: "messages_upserted", stats });
    }

    await Message.create({
      payload_type: obj.payload_type || "raw",
      raw_payload: obj,
      status: "unknown",
    });
    return res.json({ ok: true, action: "saved_raw" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
