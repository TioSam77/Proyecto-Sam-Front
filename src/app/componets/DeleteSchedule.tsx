'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import styles from '../css/DeleteSchedule.module.css';

interface Schedule {
    id: string;
    date: string; // formato "yyyy-mm-dd"
}

const DeleteSchedule = () => {
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const courseId = pathParts[3];

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedules = async () => {
        try {
            const q = query(
                collection(db, 'course_schedule'),
                where('course_id', '==', courseId)
            );
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((docSnap) => {
                const d = docSnap.data();
                return {
                    id: docSnap.id,
                    date: d.date, // Asegúrate de que sea una string tipo "2025-05-06"
                };
            });

            setSchedules(data);
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'course_schedule', id));
            setSchedules((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Error al eliminar el horario:', error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <div className={styles.containerDelete}>
          <h2 className={styles.titleDelete}>Eliminar Horarios</h2>
      
          {loading ? (
            <p className={styles.message}>Cargando horarios...</p>
          ) : schedules.length === 0 ? (
            <p className={styles.message}>No hay horarios registrados.</p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.date ? schedule.date.split('-').reverse().join('/') : 'Fecha inválida'}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className={styles.deleteButton}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
};

export default DeleteSchedule;
