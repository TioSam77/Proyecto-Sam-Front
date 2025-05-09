'use client'
import MapStudent from "@/app/componets/student/MapStudent";
import MapTeacher from "@/app/componets/teacher/MapTeacher";
import { usePathname } from "next/navigation";
import React from "react";
export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()

    const isRegistroRuta = [
        "/Administrador/Alumnos/Registro",
      ].some(route => pathname.startsWith(route));
    
    if (isRegistroRuta) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <>
            {children}
            <MapStudent />
        </>
    )
}