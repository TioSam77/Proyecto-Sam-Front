"use client"
import { useState } from "react";
import styles from "../css/Login.module.css";
import teacherStyles from "../css/Teacher.module.css";

const InfoCurse = () => {
    const [showCourses, setShowCourses] = useState(false);

    return (
        <section className={styles.loginContainer}>
            <div className={teacherStyles.box}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}
                <div className={teacherStyles.information}>
                    <h4>Profesor: Sam</h4>
                    <h4>Teléfono: 563475634</h4>
                    <h4>Correo: ejemplosam@gmail.com</h4>
                    <h4>Puesto: Profesor</h4>
                    <h4>Estado: Activo</h4>
                </div>
                <hr></hr>
                <h2 className={styles.welcomeText} onClick={() => setShowCourses(!showCourses)} style={{ cursor: "pointer" }}>
                    Cursos asignados {showCourses ? "▲" : "▼"}
                </h2>
                {showCourses && (
                    <section className={teacherStyles.curse}>
                        <div>
                            <h5>Inicio del Curso: 7-may-22</h5>
                            <h5>Nivel del Curso: 4A</h5>
                            <h5>Cantidad de clases a la semana: 2</h5>
                            <h5>Salón de clases: 301</h5>
                            <hr></hr>
                            <section>
                                <h4>Horario</h4>
                                <h5>9:00 a 11:00</h5>
                                <h5>Lunes y Martes</h5>
                            </section>
                        </div>
                        <div>
                            <h5>Inicio del Curso: 7-may-22</h5>
                            <h5>Nivel del Curso: 2A</h5>
                            <h5>Cantidad de clases a la semana: 1</h5>
                            <h5>Salón de clases: 302</h5>
                            <hr></hr>
                            <section>
                                <h4>Horario</h4>
                                <h5>9:00 a 11:00</h5>
                                <h5>Martes</h5>
                            </section>
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
};

export default InfoCurse;
