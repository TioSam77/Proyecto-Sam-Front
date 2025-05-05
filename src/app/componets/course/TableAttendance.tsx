"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";

import { Attendance } from "../../data/student";
import { usePathname } from "next/navigation";
import {
    collection,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase/clientApp";
import { doc, updateDoc, setDoc } from "firebase/firestore";

interface Student {
    id: string;
    name: string;
    attendance: {
        [date: string]: Attendance;
    };
}

interface TableProps {
    apiUrl: string;
}

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];

const TableAttendance = (props: TableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);
    const [confirmedDates, setConfirmedDates] = useState<{ [key: string]: boolean }>({});
    const [confirmedDatesStudent, setConfirmedDatesStudent] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    
    const pathname = usePathname();
    const isStudent = pathname.includes("/Alumno");
    const pathParts = pathname.split("/");
    const courseId = pathParts[pathParts.length - 2];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setScheduleData([]);
                return;
            }

            try {
                setLogin(true);

                // Obtener los días del curso
                const q = query(
                    collection(db, "course_schedule"),
                    where("course_id", "==", courseId));
                const querySnapshot = await getDocs(q);

                const schedule = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        const dateObj = (data.date as Timestamp).toDate();
                        const formatted = dateObj.toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        return {
                            id: doc.id,
                            date: formatted,
                            dateObj,
                            entry_time: data.entry_time,
                            exit_time: data.exit_time,
                            confirmed: data.confirm === true,
                        };
                    })
                    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

                setScheduleData(schedule);

                // Inicializar fechas confirmadas
                const datesMap: { [key: string]: boolean } = {};
                schedule.forEach((s) => {
                    datesMap[s.date] = s.confirmed;
                });
                setConfirmedDates(datesMap);


                const dateKeys = schedule.map((s) => s.date);
                setConfirmedDatesStudent(dateKeys);

                setNotFound(schedule.length === 0);
            } catch (err) {
                console.error("Error al obtener los días del curso:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        handleSearch();
        return () => unsubscribe();
    }, [courseId]);

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
                const attendanceValue = student.attendance[date] ?? null;
                if (!attendanceValue) return;

                const q = query(
                    collection(db, "student_course"),
                    where("course_id", "==", courseId),
                    where("student_id", "==", student.id)
                );

                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const docRef = snapshot.docs[0].ref;

                    await setDoc(
                        docRef,
                        {
                            attendance: {
                                [date]: attendanceValue,
                            },
                        },
                        { merge: true }
                    );
                }
            });

            // Paso 2: Actualiza el documento correspondiente en course_schedule
            const qSchedule = query(
                collection(db, "course_schedule"),
                where("course_id", "==", courseId)
            );
            const querySnapshot = await getDocs(qSchedule);

            // Convertir fecha del string "dd/mm/yyyy" al objeto Date
            const [day, month, year] = date.split("/").map(Number);
            const formattedDate = new Date(year, month - 1, day);

            const matchDoc = querySnapshot.docs.find((doc) => {
                const docDate = (doc.data().date as Timestamp).toDate();

                return (
                    docDate.getFullYear() === formattedDate.getFullYear() &&
                    docDate.getMonth() === formattedDate.getMonth() &&
                    docDate.getDate() === formattedDate.getDate()
                );
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
                            {scheduleData.map((s) => {
                                const date = s.date;
                                return (
                                    <th key={date}>
                                        {date}
                                        {!isStudent && !confirmedDates[date] && (
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button
                                                    className={tables.tableButton}
                                                    onClick={() => confirmColumn(date)}
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
                        ) : notFound ? (
                            <tr>
                                <td colSpan={3}>Estudiantes no Encontrados</td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}
                                >
                                    <td>{student.id}</td>
                                    <td
                                        className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]
                                            }`}
                                    >
                                        {student.name}
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
        </section>
    );
};

export default TableAttendance;
