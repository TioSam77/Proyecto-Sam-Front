"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";

import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/../firebase/clientApp";
import { usePathname } from "next/navigation";

interface Student {
    id: string;
    name: string;
    active: boolean;
    montlyPayment: boolean;
}

const TableStudent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const pathname = usePathname();
    const pathParts = pathname.split("/");
    const courseId = pathParts[pathParts.length - 2];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            try {
                setLogin(true);
                const q = query(
                    collection(db, "student_course"),
                    where("course_id", "==", courseId)
                );
                const querySnapshot = await getDocs(q);

                const studentIds = querySnapshot.docs.map(doc => doc.data().student_id);

                const students: Student[] = [];
                for (const studentId of studentIds) {
                    const studentDoc = await getDoc(doc(db, "student", studentId));

                    if (studentDoc.exists()) {
                        students.push({
                            id: studentDoc.id,
                            ...studentDoc.data(),
                        } as Student);
                    }
                }

                setData(students);
                setNotFound(students.length === 0);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
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
            <h4>Estudiantes en el curso</h4>
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
                            <th>Monto</th>
                            <th>Beca</th>
                            <th>Ultimo dia de pago</th>
                            <th>Total</th>
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
                                    <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                        {row.name}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
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
