import React from "react";
import HeaderProfesor from "../Profesor/HeaderProfesor";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <HeaderProfesor />
            {children}
        </>
    )
}