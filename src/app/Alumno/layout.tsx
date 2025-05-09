import React from "react";
import HeaderAlumno from "./HeaderAlumno";
import Header from "../componets/Header";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header/>
            {children}
        </>
    )
}