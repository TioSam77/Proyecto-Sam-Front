"use client";

import React, { useState } from "react";

type Message = {
  sender: string;
  content: string;
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "Juan", content: "Hola, ¿cómo estás?" },
    { sender: "Tú", content: "Bien, ¿y tú?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "Tú", content: newMessage }]);
    setNewMessage("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="mb-2">
        <h5>Conversación con Juan</h5>
      </div>

      <div
        className="flex-grow-1 mb-2 p-2 border rounded"
        style={{ overflowY: "auto", maxHeight: "300px" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "Tú" ? "text-end text-primary" : "text-start"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Messages;
