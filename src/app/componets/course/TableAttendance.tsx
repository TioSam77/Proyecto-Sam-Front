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
import { doc, updateDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Recommendation from "./Recommendation";

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

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];

const TableAttendance = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [scheduleData, setScheduleData] = useState<scheduleData[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [confirmedDates, setConfirmedDates] = useState<{ [key: string]: boolean }>({});
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingSchedule, setLoadingSchedule] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);

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

                const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/course-schedule/${courseId}`);
                const result = await res.json();

                if (!res.ok) {
                    console.error(result.error);
                    return;
                }

                const schedule = result.schedule;

                setScheduleData(schedule);

                const datesMap: { [key: string]: boolean } = {};
                schedule.forEach((s: any) => {
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
            // Actualiza el estado local para bloquear la columna
            setConfirmedDates((prev) => ({ ...prev, [date]: true }));

            // Paso 1: Actualiza asistencia de cada estudiante en student_course
            const updatePromises = students.map(async (student) => {
                const attendanceValue = student.attendance?.[date] ?? null;
                if (attendanceValue === null) return;

                const docRef = doc(db, "student_course", student.id);
                await setDoc(
                    docRef,
                    {
                        attendance: {
                            [date]: attendanceValue,
                        },
                    },
                    { merge: true }
                );
            });

            // Paso 2: Actualiza el documento correspondiente en course_schedule
            const qSchedule = query(
                collection(db, "course_schedule"),
                where("course_id", "==", courseId)
            );
            const querySnapshot = await getDocs(qSchedule);
            const matchDoc = querySnapshot.docs.find((docSnap) => {
                const data = docSnap.data();
                const docDate = data.date; // ya es string, no necesitas convertir
                return docDate === date;
            });

            if (matchDoc) {
                await updateDoc(doc(db, "course_schedule", matchDoc.id), {
                    confirm: true,
                });
            }

            await Promise.all(updatePromises);
            console.log(`Asistencia del ${date} confirmada correctamente`);
        } catch (err) {
            console.error("Error al confirmar asistencia:", err);
        }
    };

    const handleRecommendation = () => {
        setShowModal(true)
    }

    return (
        <section className={tables.TableContainer}>

            {!isStudent &&
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link href={`CrearDia`}>
                        <button className='bluebutton'>Agregar dia de clases</button>
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
                            <th>Recomendacion</th>
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
                                    <td>
                                        <button
                                            className="bluebutton"
                                            onClick={handleRecommendation}
                                        >Revisar</button>
                                    </td>
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

            {showModal && (//arregal esto
                <div className={stylesR.overlay}>
                    <div className={stylesR.modal}>
                        <button
                            onClick={() => setShowModal(false)}
                            className={stylesR.closeButton}
                            aria-label="Cerrar modal"
                        >
                            &times;
                        </button>
                        <Recommendation student_id="id" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default TableAttendance;
