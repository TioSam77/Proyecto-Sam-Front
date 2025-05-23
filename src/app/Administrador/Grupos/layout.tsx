'use client'
import MapCourse from "@/app/componets/course/MapCourse";
import MapStudent from "@/app/componets/student/MapStudent";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase/clientApp";
import { collection, getDocs, limit, query } from "firebase/firestore";

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
                const q = query(collection(db, "course"), limit(9));
                const querySnapshot = await getDocs(q);

                const allData: data[] = querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        name: docData.name,
                        teacher_name:docData.teacher_name
                    };
                });

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

    const isRutaExcluida = /^\/Administrador\/Grupos\/[^/]+\/(Estudiantes|Temario|Asistencia|Calificaciones|Mensajes|CrearDia|EliminarDia|InscribirEstudiante)$/.test(pathname);

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
            <MapCourse data={data} login={login} notFound={notFound} />

        </>
    )
}