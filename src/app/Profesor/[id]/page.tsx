'use client'
import Link from "next/link";
import ViewGroup from "@/app/componets/ViewGroup";
import card from "../../css/card.module.css";
import course from "../../css/Course.module.css"
import { usePathname } from "next/navigation";

export default function Page() {
  const currentPath = usePathname();
  return (
    <section className="containerSection">
      <ViewGroup />

      <section className={course.center}>
        <div className={course.containerSubjects}>
          <Link href={`${currentPath}/Asistencia`} className={card.card}>
              <h3>Asistencia</h3>
              <i className="bi bi-person-check"></i>
          </Link>

          <Link href={`${currentPath}/Calificaciones`} className={card.card}>
              <h3>Calificaciones</h3>
              <i className="bi bi-award-fill"></i>
          </Link>

          <Link href={`${currentPath}/Temario`} className={card.card}>
              <h3>Temario</h3>
              <i className="bi bi-journal-text"></i>
          </Link>
        </div>
      </section>
    </section>
  )
}