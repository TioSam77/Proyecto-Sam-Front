import React from "react";
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