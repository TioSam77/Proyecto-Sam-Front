'use client'
import { useState } from "react";

import { teacher, subject } from "@/app/data/teacher"

import create from "@/app/css/create.module.css"
import styles from "@/app/css/aviability.module.css";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Aquí podrías enviar los datos al backend
    };
    return (
        <section className={create.sectionContainer}>
            <div className={create.boxWrapper}>

                <div className={create.borderGradient}></div>

                <form className={create.loginBox}>
                    <h2>Creacion de un Grupo</h2>

                    <div className={create.separator}>
                        <label htmlFor="materia">Nombre del grupo</label>
                        <input
                            className={create.input}
                            placeholder="El nombre del grupo"
                            type="text"
                            id="materia"
                            name="materia"
                            required />
                    </div>

                    <div className={create.separator}>
                        <label htmlFor="profesor">Materia</label>
                        <select
                            className={create.select}
                            id="profesor" 
                            name="profesor" 
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
                            required>
                            <option value="">Selecciona un profesor</option>
                            {teacher.map((prof) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.name}
                                </option>
                            ))}
                        </select>
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
                                    <button className={styles.saveButton} onClick={() => handleEdit(day)}>
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
                                            <button className={styles.cancelButton} onClick={handleCancel}>
                                                Cancelar
                                            </button>
                                            <button className={styles.deleteButton} onClick={handleDelete}>
                                                Limpiar
                                            </button>
                                            <button className={styles.saveButton} onClick={handleSave}>
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        className={create.button}
                        type="submit"
                        onSubmit={handleSubmit}>
                        Crear Grupo
                    </button>
                </form>

            </div>
        </section>
    )
}

export default CreateCourse;