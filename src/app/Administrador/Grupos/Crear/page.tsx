"use client";
import { useState } from "react";
import { teacher } from "@/app/data/teacher"

import create from "@/app/css/create.module.css"

export default function Page() {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

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
        console.log("Días y horarios:", diasSeleccionados);
        // Aquí podrías enviar los datos al backend
    };

    return (
        <section>
            <h2>Crear Nuevo Grupo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="materia">Nombre de la materia</label>
                    <input
                        className={create.input}
                        type="text" id="materia" name="materia" required />
                </div>

                <div>
                    <label htmlFor="profesor">Profesor</label>
                    <select 
                    className={create.select}
                    id="profesor" name="profesor" required>
                        <option value="">Selecciona un profesor</option>
                        {teacher.map((prof) => (
                            <option key={prof.id} value={prof.id}>
                                {prof.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Días y horarios de clase</label>
                    <div className={create.containerDays}>
                        {diasSemana.map((dia) => (
                            <div key={dia} className={create.day}>
                                <label className={create.headerDay}>
                                    <input
                                        type="checkbox"
                                        checked={dia in diasSeleccionados}
                                        onChange={() => toggleDia(dia)}
                                    />
                                    {` ${dia}`}
                                </label>

                                {dia in diasSeleccionados && (
                                    <div className={create.containerShedule}>
                                        <label>
                                            Inicio:
                                            <input
                                                type="time"

                                                value={diasSeleccionados[dia].inicio}
                                                onChange={(e) => actualizarHorario(dia, "inicio", e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Fin:
                                            <input
                                                type="time"
                                                value={diasSeleccionados[dia].fin}
                                                onChange={(e) => actualizarHorario(dia, "fin", e.target.value)}
                                                required
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={create.button}
                    type="submit">Crear Grupo</button>
            </form>
        </section>
    );
}
