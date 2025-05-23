'use client'
import MapAdmin from "@/app/componets/admin/MapAdmin";
import { usePathname } from "next/navigation";
import React from "react";
export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()

    const isRegistroRuta = [
        "/Administrador/Admins/Registro",
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
            <MapAdmin />
        </>
    )
}