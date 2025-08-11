// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  payload_type: String,
  wa_id: String,
  name: String,
  from: String,
  to: String,
  message_id: { type: String, index: true },
  meta_msg_id: String,
  text: String,
  timestamp: String,            // keep as string to match payloads
  status: { type: String, default: 'sent' }, // sent/delivered/read
  status_timestamp: String,
  raw_payload: Object
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema, 'processed_messages');
