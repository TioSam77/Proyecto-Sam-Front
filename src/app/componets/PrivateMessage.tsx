"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/css/PrivateMessages.module.css";
import { BsChatDotsFill } from "react-icons/bs";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: any;
}

interface Props {
  onClose: () => void;
  currentUserUid: string;
  selectedUserUid: string;
  selectedUserName: string;
}

export default function PrivateMessages({
  onClose,
  currentUserUid,
  selectedUserUid,
  selectedUserName,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const conversationId = [currentUserUid, selectedUserUid].sort().join("_");

  useEffect(() => {
    const q = query(
      collection(db, "private-messages", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data() as Message);
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      from: currentUserUid,
      to: selectedUserUid,
      content: newMessage.trim(),
      timestamp: serverTimestamp(),
    };
    const conversationRef = doc(db, "private-messages", conversationId);

    // Crea el documento principal si no existe, con el arreglo "users"
    await setDoc(
      conversationRef,
      {
        users: [currentUserUid, selectedUserUid],
        lastUpdated: serverTimestamp(), // opcional si luego quieres ordenar por último mensaje
      },
      { merge: true }
    );

    await addDoc(collection(conversationRef, "messages"), msg);

    setNewMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BsChatDotsFill className={styles.icon} />
        <h3>{selectedUserName}</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div ref={chatBoxRef} id="chatBox" className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === currentUserUid ? styles.outgoing : styles.incoming
            }
          >
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
