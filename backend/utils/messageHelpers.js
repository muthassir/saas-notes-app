const Message = require("../models/Message.js");

function getChangesValue(obj) {
  return (
    obj?.metaData?.entry?.[0]?.changes?.[0]?.value || obj?.metaData || obj
  );
}

async function upsertMessagesFromValue(obj, value) {
  if (!value || !Array.isArray(value.messages))
    return { inserted: 0, updated: 0 };

  const contact = Array.isArray(value.contacts) ? value.contacts[0] : null;
  let inserted = 0,
    updated = 0;

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
      text: msg.text?.body || msg?.body?.text || "",
      timestamp: msg.timestamp || null,
      status: "sent",
    };

    const filter = doc.message_id
      ? { message_id: doc.message_id }
      : doc.meta_msg_id
      ? { meta_msg_id: doc.meta_msg_id }
      : null;

    if (!filter) {
      await Message.create(doc);
      inserted++;
    } else {
      await Message.findOneAndUpdate(filter, { $set: doc }, { upsert: true });
      updated++;
    }
  }
  return { inserted, updated };
}

async function applyStatusUpdatesFromValue(obj, value) {
  const statuses =
    value?.statuses || value?.messages?.[0]?.statuses || null;

  if (!Array.isArray(statuses) || statuses.length === 0)
    return { attempted: 0, updated: 0, notFound: 0 };

  let attempted = 0,
    updated = 0,
    notFound = 0;

  for (const s of statuses) {
    attempted++;
    const id = s.id || s.message_id || s?.meta_msg_id;
    const state = s.status || s?.status_type || null;
    const timestamp = s.timestamp || null;
    if (!id || !state) continue;

    const filter = { $or: [{ message_id: id }, { meta_msg_id: id }] };
    const updateDoc = { $set: { status: state } };
    if (timestamp) updateDoc.$set.status_timestamp = timestamp;

    const res = await Message.updateOne(filter, updateDoc);
    if (res.matchedCount || res.nModified) updated++;
    else notFound++;
  }

  return { attempted, updated, notFound };
}

module.exports = {
  getChangesValue,
  upsertMessagesFromValue,
  applyStatusUpdatesFromValue,
};
