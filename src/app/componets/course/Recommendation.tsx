// components/Recommendation.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../../../firebase/clientApp'

type RecommendationProps = {
  student_id: string
}

type RecommendationType = {
  id: string
  date: string
  recommendation: string
  user_name: string
}

export default function Recommendation({ student_id }: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([])
  const [newDate, setNewDate] = useState('')
  const [newRecommendation, setNewRecommendation] = useState('')
  const [user, setUser] = useState<{ uid: string; displayName: string } | null>(null)

  useEffect(() => {
    // Get auth user
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Desconocido',
        })
      }
    })

    // Listen to changes in recommendations
    const q = query(collection(db, 'recommendations'), where('student_id', '==', student_id))
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RecommendationType[]
      setRecommendations(data)
    })

    return () => {
      unsubscribeAuth()
      unsubscribeFirestore()
    }
  }, [student_id])

  const handleAddRecommendation = async () => {
    if (!newDate || !newRecommendation || !user) return

    await addDoc(collection(db, 'recommendations'), {
      date: newDate,
      recommendation: newRecommendation,
      student_id,
      user_id: user.uid,
      user_name: user.displayName,
      created_at: Timestamp.now(),
    })

    setNewDate('')
    setNewRecommendation('')
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Recomendaciones</h2>

      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border rounded-lg shadow p-3">
            <div className="font-semibold">{rec.date}</div>
            <div className="text-gray-700">{rec.recommendation}</div>
            <div className="text-sm text-gray-500 mt-1">Por: {rec.user_name}</div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium">Nueva recomendación</h3>
        <input
          type="text"
          placeholder="Día (ej. lunes)"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <textarea
          placeholder="Escribe la recomendación"
          value={newRecommendation}
          onChange={(e) => setNewRecommendation(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <button
          onClick={handleAddRecommendation}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Agregar recomendación
        </button>
      </div>
    </div>
  )
}
