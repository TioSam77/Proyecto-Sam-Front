'use client'
import MapCourse from "@/app/componets/course/MapCourse";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase/clientApp";

interface data {
    id: string
    name: string
    teacher_name: string
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [data, setData] = useState<data[]>([]);
    const [login, setLogin] = useState<boolean>(false)
    const [notFound, setNotFound] = useState(false);

    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            try {
                setLogin(true);

                const res = await fetch("https://api-uj4mkoe42a-uc.a.run.app/get-course");
                if (!res.ok) throw new Error("Error en la respuesta del servidor");

                const allData: data[] = await res.json();
                setData(allData);
                setNotFound(allData.length === 0);
            } catch (err) {
                console.error("Error al obtener cursos:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const isRegistroRuta = [
        "/Administrador/Grupos/Registro",
    ].some(route => pathname.startsWith(route));

    const isGrupoIdRuta = /^\/Administrador\/Grupos\/[^/]+$/.test(pathname);

    const isRutaExcluida = /^\/Administrador\/Grupos\/[^/]+\/(Estudiantes|Temario|Asistencia|Calificaciones|Mensajes|CrearDia|EliminarDia|EditarDia|InscribirEstudiante)$/.test(pathname);

    if ((isRegistroRuta || isGrupoIdRuta) || isRutaExcluida) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <>
            {children}
            <MapCourse data={data} login={login} notFound={notFound} show={true}/>

        </>
    )
}