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
                    <LinkCard name="Asistencia" url={`/Profesor/${curseId}/Asistencia`} icon="bi bi-person-check" />
                    <LinkCard name="Calificaciones" url={`/Profesor/${curseId}/Calificaciones`}  icon="bi bi-award-fill" />
                    <LinkCard name="Temario" url={`/Profesor/${curseId}/Temario`}  icon="bi bi-journal-text" />
                </div>
            </section>
            {children}
        </section>
    )
}