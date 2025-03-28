'use client'
import style from "@/app/css/Teacher.module.css"
import styles from "@/app/css/Login.module.css"
import card from "@/app/css/card.module.css";
import course from "@/app/css/Course.module.css"
import Table from "@/app/componets/Table"
import ViewGroup from "@/app/componets/ViewGroup"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Page() {
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");
    pathSegments.pop();
    const basePath = pathSegments.join("/");

    return (
        <section className="containerSection">
            <ViewGroup />

            <section className={course.center}>
                <div className={course.containerSubjects}>
                    <Link href={`${basePath}/Calificaciones`} className={card.card}>
                        <h3>Calificaciones</h3>
                        <i className="bi bi-award-fill"></i>
                    </Link>

                    <Link href={`${basePath}/Temario`} className={card.card}>
                        <h3>Temario</h3>
                        <i className="bi bi-journal-text"></i>
                    </Link>
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
        </section>)
}