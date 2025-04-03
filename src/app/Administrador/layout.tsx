'use client'
import LinkCard from "@/app/componets/LinkCard";
import React from "react";
import course from "@/app/css/Course.module.css"
import HeaderAdmin from "./HeaderAdmin";
import { usePathname } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    if (pathname.match(/^\/Administrador\/(Alumnos|Grupos|Profesores)\/.+/)) {
        return (
            <section className="containerSection">
                <HeaderAdmin />
                {children}
            </section>
        )
    }

    return (
        <section className="containerSection">
            <HeaderAdmin />
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