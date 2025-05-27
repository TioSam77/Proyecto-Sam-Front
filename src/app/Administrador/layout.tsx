'use client'
import LinkCard from "@/app/componets/LinkCard";
import React, { useEffect, useState } from "react";
import course from "@/app/css/Course.module.css"
import card from "@/app/css/card.module.css"
import { usePathname, useRouter } from "next/navigation";
import ReturnButton from "../componets/ReturnButton";
import Header from "../componets/Header";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const router = useRouter();

    const isAdminSubroute = pathname.match(/^\/Administrador\/(Grupos)\/.+/);
    const isRegistroRuta = [
        "/Administrador/Grupos/Registro",
        "/Administrador/Grupos/CrearMateria",
        "/Administrador/Grupos/EliminarMateria",
        "/Administrador/Alumnos/Registro",
        "/Administrador/Grupos/Carga"
    ].some(route => pathname.startsWith(route)) || /^\/Administrador\/Grupos\/.+\/Editar$/.test(pathname);

    const [userRole, setUserRole] = useState<"superAdmin" | "admin" | "teacher" | "student" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const teacherRef = doc(db, "teacher", user.uid);
                const teacherSnap = await getDoc(teacherRef);

                if (teacherSnap.exists()) {
                    const role = teacherSnap.data().role;
                    if (role === 1) setUserRole("superAdmin");
                    else if (role === 2) setUserRole("admin");
                    else if (role === 3) setUserRole("teacher");
                    else setUserRole("student");
                } else {
                    setUserRole("student");
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (userRole === "student") {
                router.push("/Alumno");
            } else if (userRole === "teacher") {
                router.push("/Profesor");
            } else if (!userRole) {
                router.push("/");
            }
        }
    }, [userRole, loading, router]);

    const isSuperAdmin = userRole === "superAdmin";

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (isAdminSubroute && !isRegistroRuta) {
        return (
            <section className="containerSection">
                <Header />
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
                    <LinkCard name="Empleados" url="/Administrador/Profesores" icon="bi bi-journal-text" />
                    {isSuperAdmin &&
                        <LinkCard name="Adminis" url="/Administrador/Admins" icon="bi bi-journal-text" />
                    }
                </div>
            </section>
            {children}
        </section>
    );
}
