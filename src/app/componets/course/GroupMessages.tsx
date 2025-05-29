'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/css/GroupMessages.module.css';
import { useParams } from 'next/navigation';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/../firebase/clientApp';

interface Response {
  author: string;
  content: string;
  date: string;
}

interface Message {
  id: string;
  author: string;
  content: string;
  date: string;
  responses: Response[];
}

const GroupMessages = () => {
  const params = useParams();
  const courseId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [responseInputs, setResponseInputs] = useState<{ [id: string]: string }>({});
  const [activeResponseBox, setActiveResponseBox] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    if (!courseId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-messages/${courseId}`);
        if (!res.ok) throw new Error("No se pudieron obtener los mensajes");

        const json = await res.json();
        setMessages(json.messages);
      } catch (err) {
        console.error("Error al obtener mensajes:", err);
      }
    };

    fetchMessages();
  }, [courseId]);

  const handlePost = async () => {
    if (newMessage.trim() === '') return;

    const user = auth.currentUser;
    if (!user) {
      alert("Debes estar autenticado para enviar mensajes");
      return;
    }

    const messageData = {
      author: user.displayName || user.email || 'Anónimo',
      id_author: user.uid,
      content: newMessage,
      date: serverTimestamp(),
    };

    try {
      const messagesRef = collection(db, 'course_messages', courseId, 'messages');
      await addDoc(messagesRef, messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  };

  const handleResponse = async (messageId: string) => {
    const content = responseInputs[messageId];
    if (!content || content.trim() === '') return;

    const user = auth.currentUser;
    if (!user) {
      alert("Debes estar autenticado para responder");
      return;
    }

    const responseData = {
      author: user.displayName || user.email || 'Anónimo',
      content,
      date: serverTimestamp(),
    };

    try {
      const responseRef = collection(db, 'course_messages', courseId, 'messages', messageId, 'responses');
      await addDoc(responseRef, responseData);
      setResponseInputs({ ...responseInputs, [messageId]: '' });
      setActiveResponseBox(null);
    } catch (error) {
      console.error("Error al guardar respuesta:", error);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.newPost}>
        <textarea
          placeholder="Escribe un mensaje para el grupo..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handlePost} className="bluebutton">Publicar</button>
      </div>

      {messages.length === 0 ? (
        <p>No hay mensajes aún.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={styles.card}>
            <div className={styles.header}>
              <strong>{msg.author}</strong>
              <span className={styles.date}>{msg.date}</span>
            </div>
            <p className={styles.content}>{msg.content}</p>

            <div className={styles.comments}>
              {msg.responses.length > 0 && <strong>Respuestas:</strong>}
              {msg.responses.map((res, idx) => (
                <div key={idx} className={styles.comment}>
                  <p className={styles.spaceBetween}>
                    <strong>{res.author}</strong>
                    <em className={styles.date}>{res.date}</em>
                  </p>
                  {res.content}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveResponseBox(activeResponseBox === msg.id ? null : msg.id)}
              className="bluebutton"
              style={{ marginTop: '0.5rem' }}
            >
              {activeResponseBox === msg.id ? 'Cancelar' : 'Responder'}
            </button>

            {activeResponseBox === msg.id && (
              <div className={styles.responseBox}>
                <textarea
                  placeholder="Escribe tu respuesta..."
                  value={responseInputs[msg.id] || ''}
                  onChange={(e) =>
                    setResponseInputs({ ...responseInputs, [msg.id]: e.target.value })
                  }
                  className={styles.textarea}
                />
                <button onClick={() => handleResponse(msg.id)} className="bluebutton">
                  Enviar respuesta
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
};

export default GroupMessages;
