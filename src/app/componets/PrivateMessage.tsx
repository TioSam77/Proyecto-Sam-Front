'use client'

import React, { useState /*, useEffect*/ } from 'react'
import styles from '@/app/css/PrivateMessages.module.css'
import { BsChatDotsFill } from 'react-icons/bs'

interface Message {
  from: string
  to: string
  content: string
  timestamp: string
}

interface Props {
  role: 'admin' | 'teacher' | 'student'
  onClose: () => void
}

export default function PrivateMessages({ role, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'Tú', to: '', content: 'Hola, ¿todo bien?', timestamp: '' },
    { from: 'Juan', to: '', content: 'Sí, ¿y tú?', timestamp: '' },
    { from: 'Tú', to: '', content: 'Listo para probar el diseño 😎', timestamp: '' },
  ])
  const [newMessage, setNewMessage] = useState('')

  // Filtros seleccionados
  const [selectedProfessor, setSelectedProfessor] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedUser, setSelectedUser] = useState('Juan') // ⚠️ Forzado para ver diseño

  // 🔧 Data Fake simulada (para Firebase futura)
  const professors = ['Prof. Juan', 'Prof. Ana']
  const groups = {
    'Prof. Juan': ['Grupo A', 'Grupo B'],
    'Prof. Ana': ['Grupo C'],
  }
  const students = {
    'Grupo A': ['Luis', 'María'],
    'Grupo B': ['Carlos'],
    'Grupo C': ['Elena'],
  }

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return

    setMessages((prev) => [
      ...prev,
      {
        from: 'Tú',
        to: selectedUser,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
    setNewMessage('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BsChatDotsFill className={styles.icon} />
        <h3>Mensajes Privados</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      {/* 
      🔒 Filtros desactivados temporalmente para visualizar estilo sin condicionales

      <div className={styles.filters}>
        {role === 'admin' && (
          <select value={selectedProfessor} onChange={e => {
            setSelectedProfessor(e.target.value)
            setSelectedGroup('')
            setSelectedUser('')
          }}>
            <option value="">Selecciona un profesor</option>
            {professors.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        {(role === 'admin' || role === 'teacher') && selectedProfessor && (
          <select value={selectedGroup} onChange={e => {
            setSelectedGroup(e.target.value)
            setSelectedUser('')
          }}>
            <option value="">Selecciona un grupo</option>
            {groups[selectedProfessor]?.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}

        {(role !== 'student' || selectedGroup) && (
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Selecciona un usuario</option>
            {role === 'student'
              ? professors.map(p => <option key={p} value={p}>{p}</option>)
              : students[selectedGroup || '']?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
      */}

      {/* 👇 Simulación directa del chat visible siempre */}
      <div className={styles.conversationHeader}>
        Conversación con <strong>{selectedUser || 'Usuario'}</strong>
      </div>

      <div id="chatBox" className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from === 'Tú' ? styles.outgoing : styles.incoming}>
            <span>
              <strong>{msg.from}:</strong> {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  )
}
