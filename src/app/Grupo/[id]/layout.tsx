'use client'
import LinkCard from "@/app/componets/LinkCard";
import ViewGroup from "@/app/componets/course/ViewGroup";
import React from "react";
import course from "@/app/css/Course.module.css"
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
                <div className={course.containerCards}>
                    <LinkCard name="Asistencia" url={`/Grupo/${curseId}/Asistencia`} icon="bi bi-person-check" />
                    <LinkCard name="Calificaciones" url={`/Grupo/${curseId}/Calificaciones`} icon="bi bi-award-fill" />
                    <LinkCard name="Temario" url={`/Grupo/${curseId}/Temario`} icon="bi bi-journal-text" />
                </div>
            </section>
            {children}
        </section>
    )
}