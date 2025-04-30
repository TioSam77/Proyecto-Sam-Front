"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { courses } from "@/app/data/courses"
import { useEffect, useState } from "react";


import styleCourse from "@/app/css/Course.module.css";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "../../../../firebase/clientApp";

const MapCourse = () => {
    const currentPath = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false)
    const [notFound, setNotFound] = useState(false);

    const isAdmin = currentPath.includes('/Administrador')
    const isStudent = currentPath.includes('/Alumno')

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            try {
                setLogin(true);
                const q = query(collection(db, "course"), limit(10));
                const querySnapshot = await getDocs(q);

                const allData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

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


    return (
        <section className={styleCourse.center}>
            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton">Buscar</button>
                {(isAdmin) && (
                    <Link href={`${currentPath}/Registro`}>
                        <button className={styleUser.button}>Nuevo Grupo</button>
                    </Link>
                )}
                {(isStudent) && (
                    <button className={styleUser.button}>Unirte a una clase</button>
                )}
            </div>
            <ol className={styleCourse.containerSubjects}>
                {data.map((course) => (
                    <li key={course.id} className={styleCourse.subjects}>
                        <div className={styleCourse.header}>
                            <Link href={`${currentPath}/${course.id}`}>
                                <div className={styleCourse.image}></div>
                                <h2 className={styleCourse.textHeader}>{course.name}</h2>
                            </Link>
                        </div>
                        <div className={styleCourse.body}>
                            <h5>Información sobre {course.name}</h5>
                        </div>
                        <div className={styleCourse.footer}>
                            <h5>Más detalles</h5>

                            {isAdmin && (
                                <div className={styleCourse.containerButton}>
                                    <button className="bluebutton">Editar</button>
                                    <button className="redbutton">Eliminar</button>
                                </div>
                            )}

                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default MapCourse;
