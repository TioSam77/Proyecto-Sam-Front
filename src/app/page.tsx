import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "./componets/Table";
import InfoCurse from "./componets/InfoCurse";
import StudentJustification from "./componets/studentJustification";
import CustomCalendar from "./componets/Calendar";
import NotificationTable from "./componets/NotificationTable"; // 🔹 Importamos el nuevo componente

import style from "./css/Teacher.module.css";

export default function Page() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
      <section className={style.infoHead}>
        <CustomCalendar />
        <div className={style.simplebox}>
          <div>
            <h4 className={style.green}>= dia de clases</h4>
            <h4 className={style.red}>= dia feriado</h4>
          </div>

          <div>
            <h4>P = Present</h4>
            <h4>PL = Present/Late</h4>
            <h4>N = Absent with notification</h4>
            <h4>A = Absent</h4>
          </div>
        </div>
      </section>

      <Table title="Asistencia de Estudiantes" apiUrl="" />
      <Table title="Resumen de Asistencia" apiUrl="" />
      <StudentJustification />
      <Table title="Horario de Clases" apiUrl="" />

      {/* 🔹 Agregamos la tabla de notificaciones aquí */}
      <NotificationTable />

    </section>
  );
}
