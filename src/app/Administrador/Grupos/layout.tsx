'use client'
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase/clientApp";
import MapCourseToAdmin from "@/app/componets/course/MapCourseToAdmin";
import styleUser from "@/app/css/User.module.css";
import Link from "next/link";
import { envCredentials } from "../../../../firebase/envConfigurations";

interface data {
    id: string
    name: string
    teacher_name: string
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [data, setData] = useState<data[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { api } = envCredentials();

    const pathname = usePathname();

    const fetchCourses = async () => {
        try {
            setLogin(true);
            const res = await fetch(`${api}/get-course`);
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
    };

    const fetchSearchResults = async () => {
        if (!searchTerm.trim()) {
            fetchCourses();
            return;
        }

        try {
            setLogin(true);
            const res = await fetch(`${ api } / searchCourse ? name = ${ encodeURIComponent(searchTerm.trim())
        }`);
            if (!res.ok) throw new Error("Error en búsqueda");
            const filtered: data[] = await res.json();
            setData(filtered);
            setNotFound(filtered.length === 0);
        } catch (err) {
            console.error("Error en búsqueda:", err);
            setNotFound(true);
        } finally {
            setLogin(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setData([]);
                return;
            }

            fetchCourses();
        });

        return () => unsubscribe();
    }, []);

    const isRegistroRuta = [
        "/Administrador/Grupos/Registro",
    ].some(route => pathname.startsWith(route));

    const isGrupoIdRuta = /^\/Administrador\/Grupos\/[^/]+$/.test(pathname);
    const isRutaExcluida = /^\/Administrador\/Grupos\/[^/]+\/(Estudiantes|Temario|Asistencia|Calificaciones|Mensajes|CrearDia|EliminarDia|EditarDia|InscribirEstudiante)$/.test(pathname);

    if ((isRegistroRuta || isGrupoIdRuta) || isRutaExcluida) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/ Administrador / Grupos / Registro`}>
                    <button className={styleUser.button}>Nuevo Grupo</button>
                </Link>
                <Link href={`/ Administrador / Grupos / Carga`}>
                    <button className={styleUser.button}>Carga masiva de Grupos</button>
                </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar curso por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton" onClick={fetchSearchResults}>Buscar</button>
            </div>
            <MapCourseToAdmin data={data} login={login} notFound={notFound} />
        </>
    );
}
