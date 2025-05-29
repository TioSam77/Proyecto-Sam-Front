'use client';

import { useEffect, useState } from 'react';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { useParams } from 'next/navigation';
import tables from "@/app/css/Table.module.css";
import styles from '@/app/css/Binnacle.module.css';
import { db } from '@/../firebase/clientApp';

type BinnacleEntry = {
    id?: string;
    date: string;
    topic: string;
    activities: string;
    observations: string;
    id_course: string;
};

export default function Binnacle() {
    const params = useParams();
    const courseId = params?.id as string;

    const [selectedEntry, setSelectedEntry] = useState<BinnacleEntry | null>(null);
    const [entries, setEntries] = useState<BinnacleEntry[]>([]);
    const [form, setForm] = useState<Omit<BinnacleEntry, 'id'>>({
        date: '',
        topic: '',
        activities: '',
        observations: '',
        id_course: courseId,
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const closeDetails = () => setSelectedEntry(null);

    const binnacleRef = collection(db, 'binnacle');

    const fetchEntries = async () => {
        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-binnacle/${courseId}`);
            if (!res.ok) throw new Error("No se pudieron obtener las entradas");

            const data = await res.json();
            setEntries(data.entries);
        } catch (error) {
            console.error("Error al obtener las entradas de bitácora:", error);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchEntries();
        }
    }, [courseId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createEntry = async (data: any) => {
        const res = await fetch("/api/binnacle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Error al crear la entrada");
        return await res.json();
    };

    const editEntry = async (id: string, data: any) => {
        const res = await fetch(`/api/binnacle/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Error al actualizar la entrada");
        return await res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.date || !form.topic) return;

        try {
            if (editId) {
                await editEntry(editId, form);
                setEditId(null);
            } else {
                await createEntry({ ...form, id_course: courseId });
            }

            setForm({ date: "", topic: "", activities: "", observations: "", id_course: courseId });
            setFormVisible(false);
            fetchEntries();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (entry: BinnacleEntry) => {
        setForm({
            date: entry.date,
            topic: entry.topic,
            activities: entry.activities,
            observations: entry.observations,
            id_course: courseId,
        });
        setEditId(entry.id!);
        setFormVisible(true);
    };


    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'binnacle', id));
        fetchEntries();
    };

    return (
        <div className={tables.TableContainer}>
            <div className={tables.selectAndButton}>
                <button
                    onClick={() => {
                        if (!isFormVisible) {
                            setForm({ date: '', topic: '', activities: '', observations: '', id_course: courseId });
                            setEditId(null);
                        }
                        setFormVisible(!isFormVisible);
                    }}
                    className='bluebutton'
                >
                    {isFormVisible ? 'Cancelar' : 'Registrar Bitácora'}
                </button>
            </div>

            <h2 className='welcomeText'>Bitácora de Clase</h2>

            {isFormVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3>{editId ? 'Modificar Bitácora' : 'Registrar Bitácora'}</h3>
                        <form onSubmit={handleSubmit} className={styles.classList}>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            />
                            <input
                                type="text"
                                name="topic"
                                value={form.topic}
                                onChange={handleChange}
                                placeholder="Tema visto"
                                className={styles.select}
                                required
                                maxLength={30}
                            />
                            <textarea
                                name="activities"
                                value={form.activities}
                                onChange={handleChange}
                                placeholder="Actividades realizadas"
                                className={styles.select}
                            />
                            <textarea
                                name="observations"
                                value={form.observations}
                                onChange={handleChange}
                                placeholder="Observaciones"
                                className={styles.select}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit" className={styles.tableButton}>
                                    {editId ? 'Guardar Cambios' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormVisible(false);
                                        setEditId(null);
                                    }}
                                    className={styles.tableButton}
                                    style={{ backgroundColor: '#d9534f' }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th className={tables.fixedColRow}>Fecha</th>
                            <th>Tema</th>
                            <th>Detalles</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                                    No hay registros aún
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry, index) => (
                                <tr key={entry.id} className={index % 2 === 0 ? tables['row-even'] : tables['row-odd']}>
                                    <td
                                        className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}
                                    >{entry.date}</td>
                                    <td>{entry.topic}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedEntry(entry)}
                                            className={styles.tableButton}
                                            style={{ backgroundColor: '#5bc0de' }}
                                        >
                                            Revisar
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            onClick={() => handleEdit(entry)}
                                            className={styles.tableButton}
                                            style={{ marginRight: '5px', backgroundColor: '#f0ad4e' }}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entry.id!)}
                                            className={styles.tableButton}
                                            style={{ backgroundColor: '#d9534f' }}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedEntry && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3>Detalle de la clase</h3>
                        <p><strong>Fecha:</strong> {selectedEntry.date}</p>
                        <p><strong>Tema:</strong> {selectedEntry.topic}</p>
                        <p><strong>Actividades:</strong> {selectedEntry.activities}</p>
                        <p><strong>Observaciones:</strong> {selectedEntry.observations}</p>
                        <button onClick={closeDetails} className={styles.tableButton}>Cerrar</button>
                    </div>
                </div>
            )}

        </div>
    );
}