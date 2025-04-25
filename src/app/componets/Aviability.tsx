'use client'
import { useState } from "react";
import styles from "../css/aviability.module.css";

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
    Lunes: { start: "10:00", end: "11:00" },
    Martes: { start: "10:00", end: "11:00" },
    Miércoles: { start: "10:00", end: "11:00" },
    Jueves: { start: "10:00", end: "11:00" },
    Viernes: { start: "10:00", end: "11:00" },
    Sábado: { start: "", end: "" },
};

const Aviability = () => {
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


    return (
        <section className={styles.container}>
            <h4>Horario de disponibilidad</h4>
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

            <button className={styles.addButton}>
                Guardar disponibilidad
            </button>
        </section>
    );
};

export default Aviability;
