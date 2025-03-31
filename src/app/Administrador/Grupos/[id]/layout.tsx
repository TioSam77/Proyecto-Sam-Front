import LinkCard from "@/app/componets/LinkCard";
import ViewGroup from "@/app/componets/ViewGroup";
import React from "react";
import course from "@/app/css/Course.module.css"

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <ViewGroup />

            <section className={course.center}>
                <div className={course.containerSubjects}>
                    <LinkCard name="Asistencia" icon="bi bi-person-check" />
                    <LinkCard name="Calificaciones" icon="bi bi-award-fill" />
                    <LinkCard name="Temario" icon="bi bi-journal-text" />
                </div>
            </section>
            {children}
        </>
    )
}