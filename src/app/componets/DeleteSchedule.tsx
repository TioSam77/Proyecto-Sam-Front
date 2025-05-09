'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';

interface Schedule {
    id: string;
    date: string;
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
                where('course_id', '==', courseId),
                limit(10)
            );
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((docSnap) => {
                const d = docSnap.data();
                const dateStr = d.date;

                return {
                    id: docSnap.id,
                    date: dateStr,
                    dateObj: new Date(dateStr),
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
        <div>
            <h2>Eliminar Horarios</h2>

            {loading ? (
                <p>Cargando horarios...</p>
            ) : schedules.length === 0 ? (
                <p>No hay horarios registrados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Día</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => {
                            const [year, month, day] = schedule.date.split("-").map(Number);
                            const dateObj = new Date(year, month - 1, day);
                            const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                            const dayName = dayNames[dateObj.getDay()];

                            return (
                                <tr key={schedule.id}>
                                    <td>
                                        <div>{dayName}</div>
                                        {schedule.date
                                            ? schedule.date.split('-').reverse().join('/')
                                            : 'Fecha inválida'}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(schedule.id)}
                                            className="bluebutton"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DeleteSchedule;
