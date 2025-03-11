import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "./componets/Table";
import CustomCalendar from "./componets/Calendar";
import NotificationTable from "./componets/NotificationTable";

import styles from "./css/Login.module.css"
import style from "./css/Teacher.module.css";
import CourseGroup from "./componets/CourseGroup";
import FormProfesor from "./componets/FormProfesor";
import TableHorario from "./componets/TableHorario";

export default function Page() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', marginTop: "80px", maxWidth:"100vw" }}>

      <FormProfesor />

      <CourseGroup />

      <section style={{ background: "white", padding: "10px", margin: "10px", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}>
        <NotificationTable />

        <hr></hr>
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

      <section style={{ background: "white", padding: "10px", margin: "10px", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}>
        <h1>Horario de clases</h1>
            <CustomCalendar />
      </section>


      <section style={{ background: "white", padding: "10px", margin: "10px", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)" }}>
        <Table apiUrl="" />
        <TableHorario/>
      </section>

    </section>
  );
}
