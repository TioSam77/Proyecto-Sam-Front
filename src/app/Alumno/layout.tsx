import React from "react";
import HeaderAlumno from "./HeaderAlumno";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <HeaderAlumno />
            {children}
        </>
    )
}