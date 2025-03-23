import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CustomCalendar from "./componets/Calendar";
import CourseGroup from "./componets/CourseGroup";
import FormProfesor from "./componets/FormProfesor";
import TableHorario from "./componets/TableHorario";

export default function Page() {
  return (
    <>
      <CourseGroup />

      <section className="containerSection">
        <h1>Horario de clases</h1>
            <CustomCalendar />
            <TableHorario/>
      </section>

    </>
  );
}
