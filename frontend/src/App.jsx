import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

// const API = "http://localhost:5000";
const API = "https://whatsapp-web-clone-api.onrender.com";

export default function App() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedWa, setSelectedWa] = useState(null);
  const [composer, setComposer] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    loadChats();
    loadMessages();
  }, []);

  async function loadChats() {
    setLoadingChats(true);
    try {
      const res = await fetch(API + "/chats");
      const data = await res.json();
      setChats(data || []);
      setSelectedWa((prev) => {
        if (prev) return prev;
        return data && data.length ? data[0]._id : null;
      });
    } catch (err) {
      console.error("loadChats error", err);
    } finally {
      setLoadingChats(false);
    }
  }

  async function loadMessages() {
    setLoadingMessages(true);
    try {
      const res = await fetch(API + "/messages");
      const all = await res.json();
      setMessages(all || []);
    } catch (err) {
      console.error("loadMessages error", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  const handleSend = async () => {
    if (!composer.trim() || !selectedWa) return;
    const contact = chats.find((c) => c._id === selectedWa);
    const payload = {
      wa_id: selectedWa,
      name: contact?.lastMessage?.name || null,
      from: "918329446654",
      to: selectedWa,
      text: composer.trim(),
    };
    try {
      const res = await fetch(API + "/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (j.ok && j.doc) {
        setMessages((prev) => [...prev, j.doc]);
        setComposer("");
        setChats((prev) => {
          const others = prev.filter((p) => p._id !== selectedWa);
          const updated = {
            _id: selectedWa,
            lastMessage: j.doc,
            count: (prev.find((p) => p._id === selectedWa)?.count || 0) + 1,
          };
          return [updated, ...others];
        });
        if (window.innerWidth < 640) setShowSidebar(false);
      } else {
        console.error("send failed", j);
      }
    } catch (err) {
      console.error("send error", err);
    }
  };

  return (
    <div className="h-screen flex bg-[#e5ddd5]">
      {showSidebar && (
        <Sidebar
          chats={chats}
          loadingChats={loadingChats}
          selectedWa={selectedWa}
          setSelectedWa={setSelectedWa}
          setShowSidebar={setShowSidebar}
        />
      )}

      <ChatWindow
        chats={chats}
        messages={messages}
        selectedWa={selectedWa}
        loadingMessages={loadingMessages}
        composer={composer}
        setComposer={setComposer}
        handleSend={handleSend}
        setShowSidebar={setShowSidebar}
      />
    </div>
  );
}
