'use client'
import LinkCard from "@/app/componets/LinkCard";
import React from "react";
import course from "@/app/css/Course.module.css"
import card from "@/app/css/card.module.css"
import { usePathname } from "next/navigation";
import ReturnButton from "../componets/ReturnButton";
import Header from "../componets/Header";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    const isAdminSubroute = pathname.match(/^\/Administrador\/(Grupos)\/.+/);
    const isRegistroRuta = [
        "/Administrador/Grupos/Registro",
        "/Administrador/Grupos/CrearMateria",
        "/Administrador/Grupos/EliminarMateria",
        "/Administrador/Alumnos/Registro"
    ].some(route => pathname.startsWith(route)) || /^\/Administrador\/Grupos\/.+\/Editar$/.test(pathname);
    
    if (isAdminSubroute && !isRegistroRuta) {
        return (
            <section className="containerSection">
                <Header />
                {children}
            </section>
        );
    }

    return (
        <section className="containerSection">
            <ReturnButton />
            <Header />
            <section className={course.center}>
                <div className={card.containerCard}>
                    <LinkCard name="Alumnos" url="/Administrador/Alumnos" icon="bi bi-person-check" />
                    <LinkCard name="Grupos" url="/Administrador/Grupos" icon="bi bi-people-fill" />
                    <LinkCard name="Empleados" url="/Administrador/Profesores" icon="bi bi-easel2-fill" />
                    <LinkCard name="Adminis" url="/Administrador/Admins" icon="bi bi-person-gear" />
                </div>
            </section>
            {children}
        </section>
    )
}