import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "./componets/Table";
import CustomCalendar from "./componets/Calendar";
import NotificationTable from "./componets/NotificationTable"; // 🔹 Importamos el nuevo componente

import style from "./css/Teacher.module.css";
import CourseGroup from "./componets/CourseGroup";
import FormProfesor from "./componets/FormProfesor";

export default function Page() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', marginTop: "80px" }}>

      <FormProfesor />

      <CourseGroup />

      <section className={style.infoHead}>
        <CustomCalendar />
        <div className={style.simplebox}>
          <div>
            <h4 className={style.green}>= dia de clases</h4>
            <h4 className={style.red}>= dia feriado</h4>
          </div>

          <div>
            <h4
              style={{ backgroundColor: "lightgreen", borderRadius: "6px", padding: "3px" }}>P = Present</h4>
            <h4 style={{ backgroundColor: "lightblue", borderRadius: "6px", padding: "3px" }}>PL = Present/Late</h4>
            <h4 style={{ backgroundColor: "#CBC3E3", borderRadius: "6px", padding: "3px" }}>N = Absent with notification</h4>
            <h4 style={{ backgroundColor: "lightcoral", borderRadius: "6px", padding: "3px" }}>A = Absent</h4>
          </div>
        </div>
      </section>

      <Table title="Asistencia de Estudiantes" apiUrl="" />

      <Table title="Calificacion del Curso" apiUrl="" />
      {/* 🔹 Agregamos la tabla de notificaciones aquí */}
      <NotificationTable />

    </section>
  );
}
