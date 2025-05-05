"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";
import { usePathname } from "next/navigation";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../../firebase/clientApp";
import { Attendance } from "../../data/student";
import { onAuthStateChanged } from "firebase/auth";

interface TableProps {
    apiUrl: string;
}

interface StudentRecord {
    id: number;
    name: string;
    grade: number | null;
}

interface Student {
    id: string;
    name: string;
    attendance: {
        [date: string]: Attendance;
    };
    grade: number;
}

const grades: (number | null)[] = [null, 5, 6, 7, 8, 9, 10];

const TableCourseFinalGrade = (props: TableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const pathname = usePathname();
    const pathParts = pathname.split("/");
    const courseId = pathParts[pathParts.length - 2];


    const isStudent = pathname.includes('/Alumno')

    const handleGradeChange = (id: string, value: number) => {
        setStudents((prevData) =>
            prevData.map((student) =>
                student.id === id
                    ? {
                        ...student,
                        grade: value,
                    }
                    : student
            )
        );
    };

    useEffect(() => {
        handleSearch();
    }, [])

    const handleSearch = () => {
        setLogin(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setStudents([]);
                setLogin(false);
                return;
            }
    
            try {
                // Solo usamos el filtro de course_id en Firestore
                const q = query(
                    collection(db, "student_course"),
                    where("course_id", "==", courseId)
                );
    
                const querySnapshot = await getDocs(q);
                const allData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Student[];
    
                // Filtramos por nombre en el frontend
                const filtered = searchTerm
                    ? allData.filter(s =>
                        s.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : allData;
    
                setStudents(filtered);
                setNotFound(filtered.length === 0);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });
    
        return () => unsubscribe();
    };
    
    const confirmGrades = async () => {
        try {
            const updatePromises = students.map(async (student) => {
                const docRef = doc(db, "student_course", student.id);
                await setDoc(docRef, { grade: student.grade ?? null }, { merge: true });
            });
    
            await Promise.all(updatePromises);
            console.log("Calificaciones confirmadas correctamente");
        } catch (error) {
            console.error("Error al confirmar calificaciones:", error);
        }
    };
    

    return (
        <section className={tables.TableContainer}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar estudiante"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button
                    className={tables.tableButton}
                    onClick={handleSearch}
                >
                    Buscar
                </button>
            </div>

            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th>Código</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Calificación
                                {!isStudent && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button
                                            className={tables.tableButton}
                                            onClick={confirmGrades}
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {login ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : notFound ? (
                            <tr>
                                <td colSpan={3}>Estudiantes no Encontrados</td>
                            </tr>
                        ) : (
                            students.map((row, index) => (
                                <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                    <td>{row.id}</td>
                                    <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                        {row.name}
                                    </td>
                                    <td style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {isStudent ?
                                            <div
                                                className={tables.select}
                                                style={{
                                                    backgroundColor:
                                                        row.grade === 10 ? "lightgreen" :
                                                            row.grade === 9 ? "lightblue" :
                                                                row.grade === 8 ? "#CBC3E3" :
                                                                    row.grade === 7 ? "lightyellow" :
                                                                        row.grade === 6 ? "orange" :
                                                                            row.grade === 5 ? "lightcoral" : "",
                                                }} >{row.grade ?? "-"}</div>
                                            :

                                            <select
                                                className={tables.select}
                                                value={row.grade ?? ""}
                                                onChange={(e) => handleGradeChange(row.id, Number(e.target.value))}
                                                style={{
                                                    backgroundColor:
                                                        row.grade === 10 ? "lightgreen" :
                                                            row.grade === 9 ? "lightblue" :
                                                                row.grade === 8 ? "#CBC3E3" :
                                                                    row.grade === 7 ? "lightyellow" :
                                                                        row.grade === 6 ? "orange" :
                                                                            row.grade === 5 ? "lightcoral" : "",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {grades.map((grade) => (
                                                    <option key={grade} value={grade ?? ""}>{grade ?? "-"}</option>
                                                ))}
                                            </select>
                                        }


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

export default TableCourseFinalGrade;
