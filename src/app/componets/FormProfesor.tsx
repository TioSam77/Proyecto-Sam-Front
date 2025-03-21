"use client"
import { useState } from "react";
import styleForm from "../css/form.module.css";


const FormProfesor = () => {
    const [form, setForm] = useState<{
        disponibilidad: { dia: string; horarios: { inicio: string; fin: string }[] }[];
    }>({
        disponibilidad: []
    });

    const handleAddDisponibilidad = () => {
        setForm((prevForm) => ({
            ...prevForm,
            disponibilidad: [...prevForm.disponibilidad, { dia: "", horarios: [{ inicio: "", fin: "" }] }]
        }));
    };

    const handleRemoveDisponibilidad = (index: number) => {
        setForm((prevForm) => {
            const disponibilidad = prevForm.disponibilidad.filter((_, i) => i !== index);
            return { ...prevForm, disponibilidad };
        });
    };

    const handleDiaChange = (index: number, value: string) => {
        setForm((prevForm) => {
            const disponibilidad = [...prevForm.disponibilidad];
            disponibilidad[index].dia = value;
            return { ...prevForm, disponibilidad };
        });
    };

    const handleAddHorario = (index: number) => {
        setForm((prevForm) => {
            const disponibilidad = prevForm.disponibilidad.map((d, i) =>
                i === index ? { ...d, horarios: [...d.horarios, { inicio: "", fin: "" }] } : d
            );
            return { ...prevForm, disponibilidad };
        });
    };

    const handleRemoveHorario = (index: number, horarioIndex: number) => {
        setForm((prevForm) => {
            const disponibilidad = prevForm.disponibilidad.map((d, i) => {
                if (i === index) {
                    return { ...d, horarios: d.horarios.filter((_, hIndex) => hIndex !== horarioIndex) };
                }
                return d;
            });
            return { ...prevForm, disponibilidad };
        });
    };

    const handleHorarioChange = (index: number, horarioIndex: number, field: "inicio" | "fin", value: string) => {
        setForm((prevForm) => {
            const disponibilidad = [...prevForm.disponibilidad];
            disponibilidad[index].horarios[horarioIndex][field] = value;
            return { ...prevForm, disponibilidad };
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Horario de disponibilidad:", form);
    };

    return (
        <section className={styleForm.container}>
            <h2 className="text-xl font-bold mb-4">Horario de Disponibilidad</h2>
            <form onSubmit={handleSubmit} className={styleForm.form}>
                <section className={styleForm.dayContainer}>
                    {form.disponibilidad.map((disp, index) => (
                        <div key={index} className={styleForm.dayAvilable}>
                            <select
                                value={disp.dia}
                                onChange={(e) => handleDiaChange(index, e.target.value)}
                                className={styleForm.selectDay}
                            >
                                <option value="">Selecciona un día</option>
                                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                                    <option key={dia} value={dia}>{dia}</option>
                                ))}
                            </select>
                            <section className={styleForm.containerSchedule}>
                            {disp.horarios.map((horario, horarioIndex) => (
                                <div key={horarioIndex} className={styleForm.schedule}>
                                    <input
                                        type="time"
                                        value={horario.inicio}
                                        onChange={(e) => handleHorarioChange(index, horarioIndex, "inicio", e.target.value)}
                                        className={styleForm.input}
                                    />
                                    <input
                                        type="time"
                                        value={horario.fin}
                                        onChange={(e) => handleHorarioChange(index, horarioIndex, "fin", e.target.value)}
                                        className={styleForm.input}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHorario(index, horarioIndex)}
                                        className={styleForm.redButton}
                                    >
                                        Borrar horario
                                    </button>
                                </div>
                            ))}
                            </section>
                            <button
                                type="button"
                                onClick={() => handleAddHorario(index)}
                                className={styleForm.blueButton}
                            >
                                Agregar Horario
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveDisponibilidad(index)}
                                className={styleForm.redButton}
                            >
                                Borrar día
                            </button>
                        </div>
                    ))}
                </section>
                <button
                    type="button"
                    onClick={handleAddDisponibilidad}
                    className={styleForm.blueButton}
                >
                    Agregar día disponible
                </button>
                <button type="submit" className={styleForm.blueButton}>
                    Enviar
                </button>
            </form>
        </section>
    );
};

export default FormProfesor;
