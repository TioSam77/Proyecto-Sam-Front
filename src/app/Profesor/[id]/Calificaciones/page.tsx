'use client'
import card from "@/app/css/card.module.css";
import course from "@/app/css/Course.module.css"
import ViewGroup from "@/app/componets/ViewGroup"
import Link from "next/link";
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
                    <Link href={`${basePath}/Asistencia`} className={card.card}>
                        <h3>Asistencia</h3>
                        <i className="bi bi-person-check"></i>
                    </Link>

                    <Link href={`${basePath}/Temario`} className={card.card}>
                        <h3>Temario</h3>
                        <i className="bi bi-journal-text"></i>
                    </Link>
                </div>
            </section>

        </section>)
}