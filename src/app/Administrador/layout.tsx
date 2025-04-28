'use client'
import LinkCard from "@/app/componets/LinkCard";
import React from "react";
import course from "@/app/css/Course.module.css"
import card from "@/app/css/card.module.css"
import HeaderAdmin from "./HeaderAdmin";
import { usePathname } from "next/navigation";
import ReturnButton from "../componets/ReturnButton";
import Header from "../componets/Header";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    const isAdminSubroute = pathname.match(/^\/Administrador\/(Alumnos|Grupos|Profesores)\/.+/);
    const isRegistroRuta = [
        "/Administrador/Profesores/Registro",
        "/Administrador/Grupos/Registro",
        "/Administrador/Alumnos/Registro",
      ].some(route => pathname.startsWith(route));
    
    if (isAdminSubroute && !isRegistroRuta) {
        return (
            <section className="containerSection">
                <HeaderAdmin />
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
                    <LinkCard name="Grupos" url="/Administrador/Grupos" icon="bi bi-award-fill" />
                    <LinkCard name="Profesores" url="/Administrador/Profesores" icon="bi bi-journal-text" />
                </div>
            </section>
            {children}
        </section>
    )
}