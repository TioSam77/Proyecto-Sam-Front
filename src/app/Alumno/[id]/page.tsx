
import ViewGroup from "@/app/componets/ViewGroup";
import card from "../../css/card.module.css";
import course from "../../css/Course.module.css"

export default function Page() {
  return (
    <section className="containerSection">
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

    </section>
  )
}