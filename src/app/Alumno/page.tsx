
import HeaderAlumno from "../Profesor/HeaderProfesor";
import CourseGroup from "../componets/MapCourse";

export default function Page() {
  return (
    <>
      <HeaderAlumno />
      <div className="containerSection">
        <CourseGroup />
      </div>
    </>
  );
}
