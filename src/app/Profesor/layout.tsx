import React from "react";
import HeaderProfesor from "./HeaderProfesor";

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