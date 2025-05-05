'use client'
import { useEffect, useState } from "react";

import { subject } from "@/app/data/teacher"

import create from "@/app/css/create.module.css"
import styles from "@/app/css/aviability.module.css";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

type Day =
    | "Lunes"
    | "Martes"
    | "Miércoles"
    | "Jueves"
    | "Viernes"
    | "Sábado";

type TimeRange = {
    start: string;
    end: string;
};

type Availability = Record<Day, TimeRange>;

const initialAvailability: Availability = {
    Lunes: { start: "", end: "" },
    Martes: { start: "", end: "" },
    Miércoles: { start: "", end: "" },
    Jueves: { start: "", end: "" },
    Viernes: { start: "", end: "" },
    Sábado: { start: "", end: "" },
};

const CreateCourse = () => {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const [availability, setAvailability] = useState<Availability>(initialAvailability);
    const [editingDay, setEditingDay] = useState<Day | null>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [courseName, setCourseName] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [subject, setSubject] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false)


    useEffect(() => {
        setLogin(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLogin(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, "teacher"));
                const allData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(allData);

                const querySnapshotSubject = await getDocs(collection(db, "subject"));
                const allDataSubjects = querySnapshotSubject.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubject(allDataSubjects);

            } catch (err) {
                console.error("Error al obtener datos:", err);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);


    const handleEdit = (day: Day) => {
        setEditingDay(day);
        setStartTime(availability[day].start);
        setEndTime(availability[day].end);
    };

    const handleSave = () => {
        if (editingDay) {
            setAvailability((prev) => ({
                ...prev,
                [editingDay]: { start: startTime, end: endTime },
            }));
        }
        setEditingDay(null);
        setStartTime("");
        setEndTime("");
    };

    const handleCancel = () => {
        setEditingDay(null);
        setStartTime("");
        setEndTime("");
    };

    const handleDelete = () => {
        if (editingDay) {
            setAvailability((prev) => ({
                ...prev,
                [editingDay]: { start: "", end: "" },
            }));
            setEditingDay(null);
            setStartTime("");
            setEndTime("");
        }
    };


    const [diasSeleccionados, setDiasSeleccionados] = useState<{
        [dia: string]: { inicio: string; fin: string };
    }>({});

    const toggleDia = (dia: string) => {
        setDiasSeleccionados((prev) =>
            dia in prev
                ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== dia))
                : { ...prev, [dia]: { inicio: "", fin: "" } }
        );
    };

    const actualizarHorario = (dia: string, tipo: "inicio" | "fin", valor: string) => {
        setDiasSeleccionados((prev) => ({
            ...prev,
            [dia]: { ...prev[dia], [tipo]: valor },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);


            const courseRef = await addDoc(collection(db, "course"), {
                name: courseName,
                subject_id: selectedSubject,
                teacher_id: selectedTeacher,
                start_date: Timestamp.fromDate(start),
                end_date: Timestamp.fromDate(end),
            });

            const courseId = courseRef.id;

            // 2. Recorrer días seleccionados con horario
            for (const [day, { start, end }] of Object.entries(availability)) {
                if (!start || !end) continue;

                // Mapea día a índice (0=Lunes ... 6=Domingo)
                const dayIndexMap: Record<string, number> = {
                    Lunes: 1,
                    Martes: 2,
                    Miércoles: 3,
                    Jueves: 4,
                    Viernes: 5,
                    Sábado: 6,
                };

                const targetDay = dayIndexMap[day];

                // 3. Generar las fechas para ese día entre el rango
                let current = new Date(parsedStartDate);

                while (current <= parsedEndDate) {
                    if (current.getDay() === targetDay) {
                        await addDoc(collection(db, "course_schedule"), {
                            course_id: courseId,
                            date: Timestamp.fromDate(new Date(current)),
                            entry_time: start,
                            exit_time: end,
                        });
                    }
                    current.setDate(current.getDate() + 1);
                }

            }

            alert("Curso y horarios creados correctamente.");
        } catch (error) {
            console.error("Error al crear el curso:", error);
            alert("Hubo un error al crear el curso.");
        }
    };

    return (
        <section className={create.sectionContainer}>
            <div className={create.boxWrapper}>

                <div className={create.borderGradient}></div>

                <form className={create.loginBox} onSubmit={handleSubmit}>
                    <h2 className={create.textCenter}>Creacion de Grupo</h2>

                    <div className={create.flex}>
                        <div>

                            <div className={create.separator}>
                                <label htmlFor="nombre">Nombre del grupo</label>
                                <input
                                    className={create.input}
                                    placeholder="El nombre del grupo"
                                    type="text"
                                    id="materia"
                                    name="materia"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={create.separator}>
                                <label htmlFor="materia">Materia</label>
                                <select
                                    className={create.select}
                                    id="materia"
                                    name="materia"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    required>
                                    <option value="">Selecciona una materia</option>
                                    {subject.map((prof) => (
                                        <option key={prof.id} value={prof.id}>
                                            {prof.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={create.separator}>
                                <label htmlFor="profesor">Profesor</label>
                                <select
                                    className={create.select}
                                    id="profesor"
                                    name="profesor"
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    required>
                                    <option value="">Selecciona un profesor</option>
                                    {data.map((prof) => (
                                        <option key={prof.id} value={prof.id}>
                                            {prof.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={create.separator}>
                                <label htmlFor="inicio">Fecha de inicio</label>
                                <input
                                    type="date"
                                    id="inicio"
                                    name="inicio"
                                    className={create.input}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={create.separator}>
                                <label htmlFor="fin">Fecha de fin</label>
                                <input
                                    type="date"
                                    id="fin"
                                    name="fin"
                                    className={create.input}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={create.separator}>
                            <label>Selecciona dias y horarios de clase</label>
                            {(Object.keys(availability) as Day[]).map((day) => (
                                <div key={day}>
                                    <div className={styles.containerDay}>
                                        <div>
                                            <h5>{day}</h5>
                                            <p>
                                                {availability[day].start && availability[day].end
                                                    ? `${availability[day].start} - ${availability[day].end}`
                                                    : "Cerrado"}
                                            </p>
                                        </div>
                                        <button
                                            className={styles.saveButton}
                                            type="button"
                                            onClick={() => handleEdit(day)}>

                                            Modificar
                                        </button>
                                    </div>

                                    {editingDay === day && (
                                        <div className={styles.form}>
                                            <h5>Modificar horario del {day}</h5>
                                            <label className={styles.label}>
                                                Hora de inicio:
                                                <input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    className={styles.input}
                                                />
                                            </label>
                                            <label className={styles.label}>
                                                Hora de fin:
                                                <input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                    className={styles.input}
                                                />
                                            </label>
                                            <div className={styles.buttonGroup}>
                                                <button
                                                    className={styles.cancelButton}
                                                    type="button"
                                                    onClick={handleCancel}>
                                                    Cancelar
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    type="button"
                                                    onClick={handleDelete}>
                                                    Limpiar
                                                </button>
                                                <button
                                                    className={styles.saveButton}
                                                    type="button"
                                                    onClick={handleSave}>
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                    <button
                        className={create.button}
                        type="submit">
                        Crear Grupo
                    </button>
                </form>

            </div>
        </section>
    )
}

export default CreateCourse;