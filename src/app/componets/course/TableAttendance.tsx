"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";
import style from "@/app/css/Teacher.module.css"
import styles from "@/app/css/Login.module.css"
import stylesR from "@/app/css/ModalRecommendation.module.css"

import { Attendance } from "../../data/student";
import { useParams, usePathname } from "next/navigation";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/../firebase/clientApp';
import Link from "next/link";
import Recommendation from "./Recommendation";
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
}

interface scheduleData {
    date: string
}
interface date {
    date: string,
    confirmed: boolean
}

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];

const TableAttendance = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [scheduleData, setScheduleData] = useState<scheduleData[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [confirmedDates, setConfirmedDates] = useState<{ [key: string]: boolean }>({});
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingSchedule, setLoadingSchedule] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const { api } = envCredentials();

    const [showModal, setShowModal] = useState(false)

    const pathname = usePathname();
    const isStudent = pathname.includes("/Alumno");
    const params = useParams();
    const courseId = params?.id as string;

    useEffect(() => {
        const getSchedule = async () => {
            try {
                setLoadingSchedule(true);
                setLogin(true);

                const res = await fetch(`${api}/course-schedule/${courseId}`);
                const result = await res.json();

                if (!res.ok) {
                    console.error(result.error);
                    return;
                }

                const schedule = result.schedule;

                setScheduleData(schedule);

                const datesMap: { [key: string]: boolean } = {};
                schedule.forEach((s: date) => {
                    datesMap[s.date] = s.confirmed;
                });

                setConfirmedDates(datesMap);
            } catch (err) {
                console.error("Error al obtener los días del curso:", err);
            } finally {
                setLoadingSchedule(false);
                setLogin(false);
            }
        };

        getSchedule();
        handleSearch();

    }, [courseId]);


    const handleSearch = () => {
        setLoadingStudents(true);
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
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);//arreglar
            } finally {
                setLoadingStudents(false);
                setLogin(false);
            }
        });

        return () => unsubscribe();
    };

    const handleSelectionChange = (id: string, date: string, value: Attendance) => {
        if (confirmedDates[date]) return;

        setStudents((prevData) =>
            prevData.map((student) =>
                student.id === id
                    ? {
                        ...student,
                        attendance: {
                            ...student.attendance,
                            [date]: value,
                        },
                    }
                    : student
            )
        );
    };

    const confirmColumn = async (date: string) => {
        try {
            setConfirmedDates((prev) => ({ ...prev, [date]: true }));

            const res = await fetch(`${api}/post - attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId,
                    date,
                    students,
                }),
            });

            if (!res.ok) throw new Error("Error al confirmar asistencia");

            console.log(`Asistencia del ${date} confirmada correctamente`);
        } catch (err) {
            console.error("Error al confirmar asistencia:", err);
        }
    };

    const handleRecommendation = (id: string) => {
        setSelectedStudentId(id);
        setShowModal(true);
    };


    return (
        <section className={tables.TableContainer}>

            {!isStudent &&
                <div className={tables.containerButton}>
                    <Link href={`CrearDia`}>
                        <button className='bluebutton'>Agregar dia de clases</button>
                    </Link>
                    <Link href={`EditarDia`}>
                        <button className='bluebutton'>Editar dia de clases</button>
                    </Link>
                    <Link href={`EliminarDia`}>
                        <button className='bluebutton'>Eliminar dia de clases</button>
                    </Link>
                </div>
            }

            <h3 className={styles.welcomeText}>Asistencia de Estudiantes</h3>
            <div className={style.simplebox}>
                <h5 style={{ backgroundColor: "lightgreen", borderRadius: "4px", padding: "3px" }}>P = Present</h5>
                <h5 style={{ backgroundColor: "lightblue", borderRadius: "4px", padding: "3px" }}>PL = Present/Late</h5>
                <h5 style={{ backgroundColor: "#CBC3E3", borderRadius: "4px", padding: "3px" }}>N = Absent with notification</h5>
                <h5 style={{ backgroundColor: "lightcoral", borderRadius: "4px", padding: "3px" }}>A = Absent</h5>
            </div>

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
                            {!isStudent &&
                                <th>Recomendacion</th>
                            }
                            <th>Apellido</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            {scheduleData.map((s) => {
                                const [year, month, day] = s.date.split("-").map(Number);
                                const dateObj = new Date(year, month - 1, day);
                                const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                                const dayName = dayNames[dateObj.getDay()];

                                return (
                                    <th key={s.date}>
                                        <div>{dayName}</div>
                                        {s.date.split('-').reverse().join('/')}
                                        {!isStudent && !confirmedDates[s.date] && (
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button
                                                    className='bluebutton'
                                                    onClick={() => confirmColumn(s.date)}
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {login ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : loadingSchedule || loadingStudents ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan={3}>Estudiantes no encontrados</td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}
                                >
                                    {!isStudent &&
                                        <td>
                                            <button
                                                className="bluebutton"
                                                onClick={() => handleRecommendation(student.id)}
                                            >
                                                Revisar
                                            </button>
                                        </td>
                                    }
                                    <td>
                                        {student.surname} {student.surname2}
                                    </td>
                                    <td
                                        className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}
                                    >
                                        {student.name} {student.name2}
                                    </td>
                                    {scheduleData.map((s) => {
                                        const date = s.date;
                                        const attendanceValue = student.attendance?.[date] ?? "";

                                        return isStudent ? (
                                            <td key={date}>
                                                <div
                                                    className={tables.select}
                                                    style={{
                                                        backgroundColor:
                                                            attendanceValue === "P"
                                                                ? "lightgreen"
                                                                : attendanceValue === "PL"
                                                                    ? "lightblue"
                                                                    : attendanceValue === "N"
                                                                        ? "#CBC3E3"
                                                                        : attendanceValue === "A"
                                                                            ? "lightcoral"
                                                                            : "",
                                                    }}
                                                >
                                                    {attendanceValue || "-"}
                                                </div>
                                            </td>
                                        ) : (
                                            <td key={date}>
                                                <select
                                                    className={tables.select}
                                                    value={attendanceValue}
                                                    onChange={(e) =>
                                                        handleSelectionChange(student.id, date, e.target.value as Attendance)
                                                    }
                                                    disabled={confirmedDates[date]}
                                                    style={{
                                                        backgroundColor:
                                                            attendanceValue === "P"
                                                                ? "lightgreen"
                                                                : attendanceValue === "PL"
                                                                    ? "lightblue"
                                                                    : attendanceValue === "N"
                                                                        ? "#CBC3E3"
                                                                        : attendanceValue === "A"
                                                                            ? "lightcoral"
                                                                            : "",
                                                        cursor: confirmedDates[date] ? "default" : "pointer",
                                                    }}
                                                >
                                                    {attendanceOptions.map((option) => (
                                                        <option key={option ?? "empty"} value={option ?? ""}>
                                                            {option ?? "-"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedStudentId && (
                <div className={stylesR.overlay}>
                    <div className={stylesR.modal}>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setSelectedStudentId(null);
                            }}
                            className={stylesR.closeButton}
                            aria-label="Cerrar modal"
                        >
                            &times;
                        </button>
                        <Recommendation student_id={selectedStudentId} />
                    </div>
                </div>
            )}
        </section>
    );
};

export default TableAttendance;
