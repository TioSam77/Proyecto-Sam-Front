import LinkCard from "@/app/componets/LinkCard";
import React from "react";
import course from "@/app/css/Course.module.css"

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <section className="containerSection">
            <section className={course.center}>
                <div className={course.containerSubjects}>
                    <LinkCard name="Alumnos" icon="bi bi-person-check" />
                    <LinkCard name="Grupos" icon="bi bi-award-fill" />
                    <LinkCard name="Profesores" icon="bi bi-journal-text" />
                </div>
            </section>
            {children}
        </section>
    )
}