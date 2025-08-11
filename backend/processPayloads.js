// processPayloads.js
// Usage: node processPayloads.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Message = require('./models/Message.js');

const MONGO_URI = process.env.MONGO_URI;
const PAYLOAD_DIR = path.join(__dirname, 'payloads');

async function connectDB() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB:', MONGO_URI);
}

function getChangesValue(obj) {
  return obj?.metaData?.entry?.[0]?.changes?.[0]?.value || obj?.metaData || obj;
}

async function upsertMessageFromValue(obj, value) {
  if (!value) return { inserted: 0, updated: 0 };
  const results = { inserted: 0, updated: 0 };

  if (Array.isArray(value.messages) && value.messages.length > 0) {
    const contact = Array.isArray(value.contacts) ? value.contacts[0] : null;
    for (const msg of value.messages) {
      const doc = {
        payload_type: obj.payload_type || null,
        raw_payload: obj,
        wa_id: contact?.wa_id || msg.from || null,
        name: contact?.profile?.name || null,
        from: msg.from || null,
        to: value?.metadata?.display_phone_number || null,
        message_id: msg.id || null,
        meta_msg_id: msg?.meta_msg_id || null,
        text: msg.text?.body || (msg?.body?.text || '') || '',
        timestamp: msg.timestamp || null,
        status: 'sent'
      };

      const filter = doc.message_id ? { message_id: doc.message_id } :
                     (doc.meta_msg_id ? { meta_msg_id: doc.meta_msg_id } : null);

      if (!filter) {
        await Message.create(doc);
        results.inserted++;
      } else {
        const res = await Message.updateOne(filter, { $set: doc }, { upsert: true });
        if (res.upsertedCount || res.upsertedId) results.inserted++;
        else if (res.matchedCount && res.modifiedCount) results.updated++;
      }
    }
  }

  return results;
}

async function applyStatusUpdatesFromValue(obj, value) {
  if (!value) return { attempted: 0, updated: 0, notFound: 0 };
  const stats = { attempted: 0, updated: 0, notFound: 0 };
  const statuses = value.statuses || (value?.messages?.[0]?.statuses) || null;
  if (!Array.isArray(statuses) || statuses.length === 0) return stats;

  for (const s of statuses) {
    stats.attempted++;
    const id = s.id || s.message_id || s?.meta_msg_id;
    const state = s.status || s?.status_type || null;
    const timestamp = s.timestamp || null;

    if (!id || !state) continue;

    const filter = { $or: [{ message_id: id }, { meta_msg_id: id }] };
    const updateDoc = { $set: { status: state } };
    if (timestamp) updateDoc.$set.status_timestamp = timestamp;

    const res = await Message.updateOne(filter, updateDoc);
    if (res.matchedCount || res.nModified) stats.updated++;
    else stats.notFound++;
  }

  return stats;
}

async function processFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const obj = JSON.parse(raw);
    const value = getChangesValue(obj);

    if (value && Array.isArray(value.statuses) && value.statuses.length > 0) {
      return { type: 'status', file: path.basename(filePath), result: await applyStatusUpdatesFromValue(obj, value) };
    } else if (value && Array.isArray(value.messages) && value.messages.length > 0) {
      return { type: 'message', file: path.basename(filePath), result: await upsertMessageFromValue(obj, value) };
    } else {
      await Message.create({ payload_type: obj.payload_type || 'raw', raw_payload: obj, status: 'unknown' });
      return { type: 'raw', file: path.basename(filePath), result: 'saved_raw' };
    }
  } catch (err) {
    return { type: 'error', file: path.basename(filePath), error: err.message };
  }
}

async function main() {
  await connectDB();

  if (!fs.existsSync(PAYLOAD_DIR)) {
    console.error('Payload directory not found:', PAYLOAD_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(PAYLOAD_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('No .json payload files found in', PAYLOAD_DIR);
    await mongoose.disconnect();
    return;
  }

  const summary = { files: files.length, messagesInserted: 0, messagesUpdated: 0, statusesAttempted: 0, statusesUpdated: 0, statusesNotFound: 0, rawSaved: 0, errors: [] };

  for (const f of files) {
    const full = path.join(PAYLOAD_DIR, f);
    const out = await processFile(full);

    if (out.type === 'message') {
      summary.messagesInserted += out.result.inserted || 0;
      summary.messagesUpdated += out.result.updated || 0;
      console.log(`[message] ${out.file} -> inserted: ${out.result.inserted}, updated: ${out.result.updated}`);
    } else if (out.type === 'status') {
      summary.statusesAttempted += out.result.attempted || 0;
      summary.statusesUpdated += out.result.updated || 0;
      summary.statusesNotFound += out.result.notFound || 0;
      console.log(`[status] ${out.file} -> attempted: ${out.result.attempted}, updated: ${out.result.updated}, notFound: ${out.result.notFound}`);
    } else if (out.type === 'raw') {
      summary.rawSaved++;
      console.log(`[raw] ${out.file} -> saved as raw payload`);
    } else if (out.type === 'error') {
      summary.errors.push({ file: out.file, error: out.error });
      console.error(`[error] ${out.file} -> ${out.error}`);
    }
  }

  console.log('--- PROCESSING SUMMARY ---');
  console.log(JSON.stringify(summary, null, 2));

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(err => {
  console.error('Fatal error', err);
  mongoose.disconnect();
});
