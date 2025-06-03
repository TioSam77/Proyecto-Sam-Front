import React from "react";
import Header from "../componets/Header";
import EmailVerificationChecker from "../componets/EmailVerification";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            <EmailVerificationChecker />
            {children}
        </>
    )
}