import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CustomCalendar from "./componets/Calendar";
import CourseGroup from "./componets/MapCourse";
import TableHorario from "./componets/TableHorario";
import ViewGroup from "./componets/ViewGroup";

export default function Page() {
  return (
    <>
      <ViewGroup />
      <CourseGroup />

      <section className="containerSection">
        <h1>Horario de clases</h1>
        <CustomCalendar />
        <TableHorario />
      </section>

    </>
  );
}
