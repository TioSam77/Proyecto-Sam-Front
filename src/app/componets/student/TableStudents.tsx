"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/../firebase/clientApp";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Student {
    id: string;
    name: string;
    name2: string;
    surname: string;
    surname2: string;
    active: boolean;
    montlyPayment: boolean;
}

const TableStudent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const params = useParams();
    const courseId = params?.id as string;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            try {
                setLogin(true);
                const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-courseStudent/${courseId}`, {
                    headers: {
                        // Agrega token de autenticación si usas Firebase Auth y validas en backend
                        // Authorization: `Bearer ${await user.getIdToken()}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al obtener estudiantes");
                }

                const json = await res.json();

                setData(json.students);
                setNotFound(json.students.length === 0);
            } catch (err) {
                console.error(err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, [courseId]);

    const handleSearch = () => {
        setLogin(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLogin(false);
                return;
            }

            try {
                const q = searchTerm
                    ? query(
                        collection(db, "student_course"),
                        where("course_id", "==", courseId),
                        where("name", ">=", searchTerm),
                        where("name", "<=", searchTerm + "\uf8ff")
                    )
                    : query(
                        collection(db, "student_course"),
                        where("course_id", "==", courseId),
                    );

                const querySnapshot = await getDocs(q);
                const allData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Student[];

                setData(allData);
                setNotFound(allData.length === 0);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    };

    return (
        <section className={tables.TableContainer}>
            <Link href={`InscribirEstudiante`}>
                <button className='bluebutton'>Inscribir Estudiante</button>
            </Link>

            <h4 className="welcomeText">Estudiantes en el curso</h4>
            <div className={tables.selectAndButton}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton" onClick={handleSearch}>
                    Buscar
                </button>
            </div>
            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th>Apellido</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Mensualidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {login ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : notFound ? (
                            <tr>
                                <td colSpan={3}>Este curso no cuenta con alumnos</td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}
                                >
                                    <td>
                                        {row.surname} {row.surname2}
                                    </td>
                                    <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                        {row.name} {row.name2}
                                    </td>
                                    <td>
                                        {!row.montlyPayment && "No pagada"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TableStudent;
