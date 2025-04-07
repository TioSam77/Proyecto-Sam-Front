'use client'
import LinkCard from "@/app/componets/LinkCard";
import ViewGroup from "@/app/componets/ViewGroup";
import React from "react";
import course from "../../css/Course.module.css"
import { usePathname } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
            const pathname = usePathname();
            const segments = pathname.split("/");
            const curseId = segments[2];

    return (
        <section className="containerSection">
            <ViewGroup />

            <section className={course.center}>
                <div className={course.containerSubjects}>
                    <LinkCard name="Asistencia" url={`/Alumno/${curseId}/Asistencia`} icon="bi bi-person-check" />
                    <LinkCard name="Calificaciones" url={`/Alumno/${curseId}/Calificaciones`} icon="bi bi-award-fill" />
                </div>
            </section>
            {children}
        </section>
    )
}