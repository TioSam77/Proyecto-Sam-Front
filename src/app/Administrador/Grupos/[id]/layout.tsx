'use client'
import LinkCard from "@/app/componets/LinkCard";
import ViewGroup from "@/app/componets/course/ViewGroup";
import React from "react";

import { usePathname } from "next/navigation";

import course from "@/app/css/Course.module.css"
import ReturnButton from "@/app/componets/ReturnButton";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const segments = pathname.split("/");
    const curseId = segments[3];

    return (
        <>
            <ReturnButton />
            <ViewGroup />
            <section className={course.center}>
                <div className={course.containerCards}>
                    <LinkCard name="Estudiantes" url={`/Administrador/Grupos/${curseId}/Estudiantes`} icon="bi bi-backpack" />
                    <LinkCard name="Asistencia" url={`/Administrador/Grupos/${curseId}/Asistencia`} icon="bi bi-person-check" />
                    <LinkCard name="Calificaciones" url={`/Administrador/Grupos/${curseId}/Calificaciones`} icon="bi bi-award-fill" />
                </div>
            </section>
            {children}
        </>
    )
}