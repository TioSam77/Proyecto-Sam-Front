"use client";

import HeaderAlumno from "../Profesor/HeaderProfesor";
import CourseGroup from "../componets/MapCourse";

export default function Page() {
  return (
    <>
      <HeaderAlumno />
      <div style={{ paddingTop: "80px" }}>
        <CourseGroup />
      </div>
    </>
  );
}
