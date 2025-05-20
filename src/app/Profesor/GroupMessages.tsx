'use client';
import React, { useState } from 'react';
import styles from '@/app/css/GroupMessages.module.css';

interface Message {
  id: number;
  author: string;
  content: string;
  date: string;
  comments: string[];
}

const GroupMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "Profa. María Jiménez",
      content: "Hola a todos, recuerden que mañana la clase inicia a las 9:00 am. ¿Todos de acuerdo?",
      date: "18 mayo",
      comments: ["Sí, sin problema.", "¿Será en el mismo salón?"]
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handlePost = () => {
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: Date.now(),
      author: "Tú",
      content: newMessage,
      date: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
      }),
      comments: [],
    };

    setMessages([newMsg, ...messages]);
    setNewMessage('');
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

      {messages.map((msg) => (
        <div key={msg.id} className={styles.card}>
          <div className={styles.header}>
            <strong>{msg.author}</strong>
            <span className={styles.date}>{msg.date}</span>
          </div>
          <p className={styles.content}>{msg.content}</p>
          <div className={styles.comments}>
            {msg.comments.map((comment, idx) => (
              <p key={idx} className={styles.comment}>
                <strong>Alumno:</strong> {comment}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default GroupMessages;
