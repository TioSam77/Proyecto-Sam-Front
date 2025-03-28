import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CustomCalendar from "./componets/Calendar";
import TableHorario from "./componets/TableHorario";

export default function Page() {
  return (
    <>
      <section className="containerSection">
        <h1>Horario de clases</h1>
        <CustomCalendar />
        <TableHorario />
      </section>

    </>
  );
}
