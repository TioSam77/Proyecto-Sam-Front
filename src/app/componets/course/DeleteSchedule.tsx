'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/../firebase/clientApp';
import styles from '@/app/css/DeleteSchedule.module.css';

interface Schedule {
    id: string;
    date: string;
}

const DeleteSchedule = () => {
    const params = useParams();
    const courseId = params?.id as string;

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedules = async () => {
        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-schedule/${courseId}`);
            if (!res.ok) throw new Error("No se pudo obtener el horario");

            const json = await res.json();

            const sorted: Schedule[] = json.schedules.map((s: { id: string; date: string }) => ({
                id: s.id,
                date: s.date,
                dateObj: new Date(s.date),
            }));

            setSchedules(sorted);
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/delete-schedule/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Error al eliminar el horario");
            }

            setSchedules((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Error al eliminar el horario:", error);
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
                            {schedules.map((schedule) => {
                                const [year, month, day] = schedule.date.split("-").map(Number);
                                const dateObj = new Date(year, month - 1, day);
                                const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                                const dayName = dayNames[dateObj.getDay()];

                                return (
                                    <tr key={schedule.id}>
                                        <td>
                                            <div>{dayName}</div>
                                            {schedule.date ? schedule.date.split('-').reverse().join('/') : 'Fecha inválida'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(schedule.id)}
                                                className={styles.deleteButton}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DeleteSchedule;
