'use client'

import React, { useState } from 'react'

import styles from '@/app/css/PrivateMessages.module.css'
import PrivateMessages from './PrivateMessage'

export default function MessagePanel() {
    const [tab, setTab] = useState<'professors' | 'students'>('professors')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<string[]>([])
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [showChat, setShowChat] = useState(false)

    const handleSearch = async () => {
        // 🔍 Simula una búsqueda (reemplaza por lógica real)
        const fetchedResults =
            tab === 'professors'
                ? ['Prof. Juan', 'Prof. Ana'].filter(name => name.toLowerCase().includes(query.toLowerCase()))
                : ['Luis', 'Carlos', 'Elena'].filter(name => name.toLowerCase().includes(query.toLowerCase()))

        setResults(fetchedResults)
    }

    const handleSelectUser = (user: string) => {
        setSelectedUser(user)
        setShowChat(true)
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabContainer}>
                <button
                    className={tab === 'professors' ? styles.activeTab : ''}
                    onClick={() => {
                        setTab('professors')
                        setQuery('')
                        setResults([])
                        setShowChat(false)
                    }}
                >
                    Profesores
                </button>
                <button
                    className={tab === 'students' ? styles.activeTab : ''}
                    onClick={() => {
                        setTab('students')
                        setQuery('')
                        setResults([])
                        setShowChat(false)
                    }}
                >
                    Estudiantes
                </button>
            </div>

            <div className={styles.searchSection}>
                <input
                    type="text"
                    placeholder={`Buscar ${tab === 'professors' ? 'profesor' : 'estudiante'}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>

            <div className={styles.results}>
                {results.map((user) => (
                    <div
                        key={user}
                        className={styles.resultItem}
                        onClick={() => handleSelectUser(user)}
                    >
                        {user}
                    </div>
                ))}
            </div>

            {showChat && selectedUser && (
                <PrivateMessages
                    onClose={() => {
                        setShowChat(false)
                        setSelectedUser(null)
                    }}
                />
            )}
        </div>
    )
}
