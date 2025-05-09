import React from "react";
import HeaderProfesor from "./HeaderProfesor";
import ReturnButton from "../componets/ReturnButton";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <section className="containerSection">
            <HeaderProfesor />
            {children}
        </section>
    )
}