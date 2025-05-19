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
import styles from '../css/Binnacle.module.css';
import { db } from '../../../firebase/clientApp';

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

    const binnacleRef = collection(db, 'binnacle');
    const closeDetails = () => setSelectedEntry(null);

    const fetchEntries = async () => {
        const q = query(binnacleRef, where('id_course', '==', courseId));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BinnacleEntry))
            .sort((a, b) => b.date.localeCompare(a.date)); // Orden descendente por fecha

        setEntries(docs);
    };

    useEffect(() => {
        if (courseId) {
            fetchEntries();
        }
    }, [courseId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.date || !form.topic) return;

        if (editId) {
            const ref = doc(db, 'binnacle', editId);
            await updateDoc(ref, form);
            setEditId(null);
        } else {
            await addDoc(binnacleRef, { ...form, id_course: courseId });
        }

        setForm({ date: '', topic: '', activities: '', observations: '', id_course: courseId });
        setFormVisible(false);
        fetchEntries();
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
        <div className={styles.TableContainer}>
            <div className={styles.selectAndButton}>
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

            <h2>Bitácora de Clase</h2>

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
                                maxLength={60}
                            />
                            <textarea
                                name="activities"
                                value={form.activities}
                                onChange={handleChange}
                                placeholder="Actividades realizadas"
                                className={styles.select}
                                maxLength={60}
                            />
                            <textarea
                                name="observations"
                                value={form.observations}
                                onChange={handleChange}
                                placeholder="Observaciones"
                                className={styles.select}
                                maxLength={60}
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

            <div className={styles.box}>
                <table>
                    <thead>
                        <tr className={styles.fixedRow}>
                            <th className={styles.fixedColRow}>Fecha</th>
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
                                <tr key={entry.id} className={index % 2 === 0 ? styles['row-even'] : styles['row-odd']}>
                                    <td
                                        className={`${styles.fixedCol} ${index % 2 === 0 ? styles["row-even"] : styles["row-odd"]}`}
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