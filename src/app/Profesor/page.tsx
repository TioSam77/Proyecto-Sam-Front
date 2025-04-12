
import style from "../css/Teacher.module.css"
import styles from "../css/Login.module.css"
import Table from "../componets/Table";
import CourseGroup from "../componets/MapCourse";
import ViewGroup from "../componets/ViewGroup";
import card from "../css/card.module.css";
import course from "../css/Course.module.css"
import HeaderProfesor from "./HeaderProfesor";


export default function Page() {
  return (
    <>
    <HeaderProfesor />
    <section className="containerSection">
      <CourseGroup />

      <ViewGroup />

      <section className={course.center}>
        <div className={course.containerSubjects}>
          <div className={card.card}>
            <h3>Asistencia</h3>
            <i className="bi bi-person-check"></i>
          </div>

          <div className={card.card}>
            <h3>Calificaciones</h3>
            <i className="bi bi-award-fill"></i>
          </div>

          <div className={card.card}>
            <h3>Temario</h3>
            <i className="bi bi-journal-text"></i>
          </div>
        </div>
      </section>


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
  )
}