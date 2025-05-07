"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, limit, where, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/clientApp";
import { usePathname } from "next/navigation";

interface Student {
    id: string;
    name: string;
    active: boolean;
}

const TableAddStudent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const pathname = usePathname();

    const pathParts = pathname.split("/");
    const courseId = pathParts[3];

    useEffect(() => {
        handleSearch();
    }, []);

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
                        collection(db, "student"),
                        where("name", ">=", searchTerm),
                        where("name", "<=", searchTerm + "\uf8ff")
                    )
                    : query(collection(db, "student"), limit(10));

                const querySnapshot = await getDocs(q);
                const students = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Student[];

                // Verificar si cada estudiante está registrado en el curso
                const studentsWithStatus = await Promise.all(
                    students.map(async (student) => {
                        const relQuery = query(
                            collection(db, "student_course"),
                            where("student_id", "==", student.id),
                            where("course_id", "==", courseId)
                        );

                        const relSnapshot = await getDocs(relQuery);
                        const isRegistered = !relSnapshot.empty;

                        return {
                            ...student,
                            active: isRegistered, // Esto activa el toggle visual
                        };
                    })
                );

                setData(studentsWithStatus);
                setNotFound(studentsWithStatus.length === 0);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    };


    const handleRegister = async (student: Student) => {
        try {
            // Verificar si el curso existe
            const courseRef = query(
                collection(db, "course"),
                where("__name__", "==", courseId)
            );
            const courseSnap = await getDocs(courseRef);
            if (courseSnap.empty) {
                alert("El curso no existe.");
                return;
            }

            // Verificar si el estudiante existe
            const studentRef = query(
                collection(db, "student"),
                where("__name__", "==", student.id)
            );
            const studentSnap = await getDocs(studentRef);
            if (studentSnap.empty) {
                alert("El estudiante no existe.");
                return;
            }

            // Registrar la relación
            const customId = `${student.id}_${courseId}`;
            await setDoc(doc(db, "student_course", customId), {
                name: student.name,
                student_id: student.id,
                course_id: courseId,
            });

            alert(`Estudiante ${student.name} registrado correctamente.`);
        } catch (error) {
            console.error("Error al registrar estudiante:", error);
            alert("Ocurrió un error al registrar al estudiante.");
        }
    };

    const handleRemove = async (student: Student) => {
        try {
            const relationRef = query(
                collection(db, "student_course"),
                where("student_id", "==", student.id),
                where("course_id", "==", courseId)
            );
            const relationSnap = await getDocs(relationRef);

            if (relationSnap.empty) {
                alert("El estudiante no está registrado en este curso.");
                return;
            }

            const batchDelete = relationSnap.docs.map(docRef => deleteDoc(doc(db, "student_course", docRef.id)));
            await Promise.all(batchDelete);

            alert(`Estudiante ${student.name} fue retirado del curso.`);

            setData(prev =>
                prev.map(s =>
                    s.id === student.id ? { ...s, active: false } : s
                )
            );
        } catch (error) {
            console.error("Error al sacar al estudiante:", error);
            alert("Ocurrió un error al retirar al estudiante del curso.");
        }
    };

    return (
        <section className={tables.TableContainer}>
            <h4>Agregar estudiante al curso</h4>
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
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Curso actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {login ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : notFound ? (
                            <tr>
                                <td colSpan={3}>Estudiante no encontrado</td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}
                                >
                                    <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                        {row.name}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => row.active ? handleRemove(row) : handleRegister(row)}
                                            className={row.active ? "toggle-button active" : "toggle-button"}
                                        >
                                            {row.active ? "Eliminar" : "Inscribir"}
                                        </button>

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

export default TableAddStudent;
