'use client'
import style from "@/app/css/Teacher.module.css"
import styles from "@/app/css/Login.module.css"
import { usePathname } from "next/navigation";
import StudentTable from "@/app/componets/StudentTable";

export default function Page() {
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");
    pathSegments.pop();
    const basePath = pathSegments.join("/");

    return (
        <>
            <h3 className={styles.welcomeText}>Asistencia de Estudiantes</h3>
            <section className={style.infoHead}>
                <div className={style.simplebox}>
                    <h5 style={{ backgroundColor: "lightgreen", borderRadius: "4px", padding: "3px" }}>P = Present</h5>
                    <h5 style={{ backgroundColor: "lightblue", borderRadius: "4px", padding: "3px" }}>PL = Present/Late</h5>
                    <h5 style={{ backgroundColor: "#CBC3E3", borderRadius: "4px", padding: "3px" }}>N = Absent with notification</h5>
                    <h5 style={{ backgroundColor: "lightcoral", borderRadius: "4px", padding: "3px" }}>A = Absent</h5>
                </div>
                <StudentTable/>
            </section>
        </>
    )
}