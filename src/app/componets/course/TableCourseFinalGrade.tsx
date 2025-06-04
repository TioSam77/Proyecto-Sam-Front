"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";
import { useParams, usePathname } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from '@/../firebase/clientApp';
import { Attendance } from "../../data/student";
import { onAuthStateChanged } from "firebase/auth";
import style from "@/app/css/Login.module.css"
import stylesLogin from "@/app/css/Login.module.css";
import { envCredentials } from "../../../../firebase/envConfigurations";


interface Student {
    id: string;
    name: string;
    name2: string;
    surname: string;
    surname2: string;
    attendance: {
        [date: string]: Attendance;
    };
    grade: string;
}

const TableCourseFinalGrade = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const [error, setError] = useState<string | null>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { api } = envCredentials();

    const pathname = usePathname();
    const params = useParams();
    const courseId = params?.id as string;


    const isStudent = pathname.includes('/Alumno')

    const handleGradeChange = (id: string, value: string) => {
        if (!/^\d{0,3}(\.\d{0,2})?$/.test(value) && value !== "") return;

        const numericValue = parseFloat(value);
        if (numericValue > 100) return;

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
        const cleanup = handleSearch();
        return cleanup;
    }, [])

    const confirmGrades = async () => {
        setAlert("");
        setError("");
        setLoading(true);

        const sanitizedStudents = students.map(s => ({
            ...s,
            grade: parseFloat(s.grade)
        }));


        try {
            const res = await fetch(`${api}/post-grade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ students: sanitizedStudents }),
            });

            if (!res.ok) throw new Error("Error al confirmar calificaciones");

            setAlert("Calificaciones confirmadas correctamente");
        } catch (error) {
            setError(`Error al confirmar calificaciones: ${error}`);
        } finally {
            setLoading(false);
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
                    className='bluebutton'
                    onClick={handleSearch}
                >
                    Buscar
                </button>
            </div>

            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th>Apellido</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Calificación
                                {!isStudent && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button
                                            className='bluebutton'
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
                            students.map((row, index) => {
                                const gradeNum = parseFloat(row.grade);

                                const backgroundColor = !isNaN(gradeNum)
                                    ? gradeNum >= 90 ? "lightgreen"
                                        : gradeNum >= 80 ? "lightblue"
                                            : gradeNum >= 70 ? "#CBC3E3"
                                                : gradeNum >= 60 ? "lightyellow"
                                                    : gradeNum >= 50 ? "orange"
                                                        : "lightcoral"
                                    : "";

                                return (
                                    <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                        <td>{row.surname} {row.surname2}</td>
                                        <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                            {row.name} {row.name2}
                                        </td>
                                        <td style={{ display: "flex", justifyContent: "center" }}>
                                            {isStudent ? (
                                                <div
                                                    className={tables.select}
                                                    style={{
                                                        textAlign: "center",
                                                        backgroundColor,
                                                    }}
                                                >
                                                    {!isNaN(gradeNum) ? gradeNum : "-"}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    className={tables.select}
                                                    value={row.grade}
                                                    onChange={(e) => handleGradeChange(row.id, e.target.value)}
                                                    style={{
                                                        width: "50px",
                                                        textAlign: "center",
                                                        backgroundColor,
                                                    }}
                                                    placeholder="-"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
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
