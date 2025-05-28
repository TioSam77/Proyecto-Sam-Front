'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../../firebase/clientApp';
import styles from '@/app/css/Recommendation.module.css';

type RecommendationProps = {
  student_id: string;
};

type RecommendationType = {
  id: string;
  date: string;
  recommendation: string;
  user_name: string;
};

export default function Recommendation({ student_id }: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');
  const [user, setUser] = useState<{ uid: string; displayName: string } | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Desconocido',
        });
      }
    });

    const q = query(collection(db, 'recommendations'), where('student_id', '==', student_id));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RecommendationType[];
      setRecommendations(data);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, [student_id]);

  const handleAddRecommendation = async () => {
    if (!newDate || !newRecommendation || !user) return;

    await addDoc(collection(db, 'recommendations'), {
      date: newDate,
      recommendation: newRecommendation,
      student_id,
      user_id: user.uid,
      user_name: user.displayName,
      created_at: Timestamp.now(),
    });

    setNewDate('');
    setNewRecommendation('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recomendaciones</h2>

      <div className={styles.list}>
        {recommendations.map((rec) => (
          <div key={rec.id} className={styles.card}>
            <div className={styles.cardDate}>{rec.date}</div>
            <div className={styles.cardText}>{rec.recommendation}</div>
            <div className={styles.cardAuthor}>Por: {rec.user_name}</div>
          </div>
        ))}
      </div>

      <div className={styles.form}>
        <h3 className={styles.formTitle}>Nueva recomendación</h3>
        <input
          type="text"
          placeholder="Día (ej. lunes)"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Escribe la recomendación"
          value={newRecommendation}
          onChange={(e) => setNewRecommendation(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleAddRecommendation} className={styles.button}>
          Agregar recomendación
        </button>
      </div>
    </div>
  );
}
