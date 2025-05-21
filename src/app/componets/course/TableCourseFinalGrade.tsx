"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";
import { useParams, usePathname } from "next/navigation";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../../firebase/clientApp";
import { Attendance } from "../../data/student";
import { onAuthStateChanged } from "firebase/auth";
import style from "@/app/css/Login.module.css"
import stylesLogin from "@/app/css/Login.module.css";


interface Student {
    id: string;
    name: string;
    attendance: {
        [date: string]: Attendance;
    };
    grade: number;
}

const TableCourseFinalGrade = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const [error, setError] = useState<string | null>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    const pathname = usePathname();
    const params = useParams();
    const courseId = params?.id as string;


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
                    where("course_id", "==", courseId),
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
                console.error("Error al obtener estudiantes:", err);//arreglar
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    };

    useEffect(() => {
        handleSearch();
    }, [])

    const confirmGrades = async () => {
        setAlert("")
        setError("")
        setLoading(true)
        try {
            const updatePromises = students.map(async (student) => {
                const docRef = doc(db, "student_course", student.id);
                await setDoc(docRef, { grade: student.grade ?? null }, { merge: true });
            });

            await Promise.all(updatePromises);
            setAlert("Calificaciones confirmadas correctamente");
            setLoading(false)
        } catch (error) {
            setError(`Error al confirmar calificaciones: ${error}`);
            setLoading(false)
        }
    };


    return (
        <section className={tables.TableContainer}>

            <h3 className={style.welcomeText}>Calificaciones de estudiantes</h3>
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
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Calificación
                                {!isStudent && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button
                                            className={tables.tableButton}
                                            onClick={confirmGrades}
                                            disabled={loading}
                                        >
                                            Asignar
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
                                                    textAlign: "center",
                                                    backgroundColor:
                                                        !isNaN(row.grade) ? (
                                                            row.grade >= 90 ? "lightgreen" :
                                                                row.grade >= 80 ? "lightblue" :
                                                                    row.grade >= 70 ? "#CBC3E3" :
                                                                        row.grade >= 60 ? "lightyellow" :
                                                                            row.grade >= 50 ? "orange" :
                                                                                "lightcoral"
                                                        ) : "",
                                                }}
                                            >
                                                {(!isNaN(row.grade) && row.grade !== null) ? row.grade : "-"}
                                            </div>

                                            :

                                            <input
                                                type="text"
                                                inputMode="decimal" // <-- ayuda a dispositivos móviles
                                                className={tables.select}
                                                value={row.grade !== null && !isNaN(row.grade) ? String(row.grade) : ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    // Permitir campo vacío
                                                    if (value === "") {
                                                        handleGradeChange(row.id, NaN);
                                                        return;
                                                    }

                                                    // Permitir decimales válidos (punto como separador)
                                                    const numericValue = parseFloat(value);
                                                    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
                                                        handleGradeChange(row.id, numericValue);
                                                    }
                                                }}
                                                style={{
                                                    width:"50px",
                                                    textAlign: "center",
                                                    backgroundColor:
                                                        !isNaN(row.grade) ? (
                                                            row.grade >= 90 ? "lightgreen" :
                                                                row.grade >= 80 ? "lightblue" :
                                                                    row.grade >= 70 ? "#CBC3E3" :
                                                                        row.grade >= 60 ? "lightyellow" :
                                                                            row.grade >= 50 ? "orange" :
                                                                                "lightcoral"
                                                        ) : "",
                                                }}
                                                placeholder="-"
                                            />

                                        }

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
                {alert && <div className={stylesLogin.alertBox}>{alert}</div>}
                {loading && <div className={stylesLogin.loading}>loading</div>}
            </div>
        </section>
    );
};

export default TableCourseFinalGrade;
