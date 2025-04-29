"use client"
import { useState } from "react";
import teacherStyles from "../css/Teacher.module.css";
import MapCourse from "../course/MapCourse";

const InfoProfesor = () => {
    const [showCourses, setShowCourses] = useState(false);

    return (
        <section className={teacherStyles.teacherContainer}>
            <div className={teacherStyles.box}>
                <div className={teacherStyles.information}>
                    <h2 className={teacherStyles.teacherName}>Sam</h2>
                    <p><strong>Teléfono:</strong> 563475634</p>
                    <p><strong>Correo:</strong>ejemplosam@gmail.com</p>
                    <p><strong>Puesto:</strong>Profesor</p>
                    <p><strong>Estado:</strong> Activo</p>
                </div>
                <hr></hr>
                <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: "pointer" }}>
                    Cursos asignados {showCourses ? "▲" : "▼"}
                </h3>
                {showCourses && (
                    <MapCourse/>
                )}
            </div>
        </section>
    );
};

export default InfoProfesor;
