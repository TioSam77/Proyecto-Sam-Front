
import ViewGroup from "@/app/componets/ViewGroup";
import course from "../../css/Course.module.css"
import LinkCard from "@/app/componets/LinkCard";

export default function Page() {
  return (
    <section className="containerSection">
      <ViewGroup />

      <section className={course.center}>
        <div className={course.containerSubjects}>
          <LinkCard name="Asistencia" icon="bi bi-person-check" />
          <LinkCard name="Calificaciones" icon="bi bi-award-fill" />
        </div>
      </section>

    </section>
  )
}