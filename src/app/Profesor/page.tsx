'use client';

import React from "react";
import InfoProfesor from "../componets/InfoProfesor";
import NotificationTable from "../componets/NotificationTable";
import Table from "../componets/Table";
import CourseGroup from "../componets/MapCourse";
import ViewGroup from "../componets/ViewGroup";
import HeaderProfesor from "../Profesor/HeaderProfesor"; 
import style from "../css/Teacher.module.css";
import styles from "../css/Login.module.css";

export default function Page() {
  const handleAddGroupMessage = () => {
    alert("Abrir modal para mensaje grupal");
  };

  const handleDeleteGroupMessage = (id: number) => {
    alert(`Eliminar mensaje con ID: ${id} (simulado)`);
  };

  return (
    <>
      <HeaderProfesor /> {/* Se agrega el header fijo */}
      <section className="containerSection" style={{ marginTop: "80px" }}>
        <CourseGroup />
        <ViewGroup />

        <h3 className={styles.welcomeText}>Asistencia de Estudiantes</h3>

        <section className={style.infoHead}>
          <div className={style.simplebox}>
            <h5 style={{ backgroundColor: "lightgreen", borderRadius: "4px", padding: "3px" }}>P = Present</h5>
            <h5 style={{ backgroundColor: "lightblue", borderRadius: "4px", padding: "3px" }}>PL = Present/Late</h5>
            <h5 style={{ backgroundColor: "#CBC3E3", borderRadius: "4px", padding: "3px" }}>N = Absent with notification</h5>
            <h5 style={{ backgroundColor: "lightcoral", borderRadius: "4px", padding: "3px" }}>A = Absent</h5>
          </div>
          <Table apiUrl="" />
        </section>
      </section>
    </>
  );
}
