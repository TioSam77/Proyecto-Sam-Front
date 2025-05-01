"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";

import { initialData, Attendance } from "../../data/student";
import { usePathname } from "next/navigation";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase/clientApp";


interface TableProps {
    apiUrl: string;
}

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];

const TableAttendance = (props: TableProps) => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const Pathname = usePathname();
    const [scheduleData, setscheduleData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);
    const [confirmedDates, setConfirmedDates] = useState<{ [key: string]: boolean }>({});
    const [confirmedDatesStudent, setConfirmedDatesStudent] = useState<string[]>([]);

    const isStudent = Pathname.includes('/Alumno')

    const pathParts = Pathname.split("/");
    const courseId = pathParts[pathParts.length - 2]; // Penúltimo segmento de la URL donde esta el id del course


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setscheduleData([]);
                return;
            }

            try {
                setLogin(true);

                const q = query(
                    collection(db, "course_schedule"),
                    where("course_id", "==", courseId)
                );
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
                        };
                    })
                    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // ORDEN CRONOLÓGICO


                setscheduleData(schedule);

                // Inicializar fechas confirmadas para admin (false)
                const datesMap: { [key: string]: boolean } = {};
                schedule.forEach((s) => {
                    datesMap[s.date] = false;
                });
                setConfirmedDates(datesMap);

                // Inicializar fechas confirmadas para alumnos
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

        return () => unsubscribe();
    }, [courseId]);


    const handleSelectionChange = (id: number, date: string, value: Attendance) => {
        if (confirmedDates[date]) return;
        setData((prevData) =>
            prevData.map((row) =>
                row.id === id
                    ? { ...row, attendance: { ...row.attendance, [date]: value } }
                    : row
            )
        );
    };

    const confirmColumn = (date: string) => {
        setConfirmedDates((prev) => ({ ...prev, [date]: true }));
    };

    const filteredData = data.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <section className={tables.TableContainer}>
            <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchBox"
            />
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
                        {filteredData.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                <td>{row.id}</td>
                                <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                    {row.name}
                                </td>

                                {scheduleData.map((s) => {
                                    const date = s.date;
                                    return isStudent ? (
                                        <td key={date} style={{ display: "flex", justifyContent: "center" }}>
                                            <div
                                                className={tables.select}
                                                style={{
                                                    backgroundColor:
                                                        row.attendance[date] === "P"
                                                            ? "lightgreen"
                                                            : row.attendance[date] === "PL"
                                                                ? "lightblue"
                                                                : row.attendance[date] === "N"
                                                                    ? "#CBC3E3"
                                                                    : row.attendance[date] === "A"
                                                                        ? "lightcoral"
                                                                        : "",
                                                }}
                                            >
                                                {row.attendance[date] ?? "-"}
                                            </div>
                                        </td>
                                    ) : (
                                        <td key={date}>
                                            <select
                                                className={tables.select}
                                                value={row.attendance[date] ?? ""}
                                                onChange={(e) => handleSelectionChange(row.id, date, e.target.value as Attendance)}
                                                disabled={confirmedDates[date]}
                                                style={{
                                                    backgroundColor:
                                                        row.attendance[date] === "P"
                                                            ? "lightgreen"
                                                            : row.attendance[date] === "PL"
                                                                ? "lightblue"
                                                                : row.attendance[date] === "N"
                                                                    ? "#CBC3E3"
                                                                    : row.attendance[date] === "A"
                                                                        ? "lightcoral"
                                                                        : "",
                                                    cursor: confirmedDates[date] ? "default" : "pointer",
                                                }}
                                            >
                                                {attendanceOptions.map((option) => (
                                                    <option key={option} value={option ?? ""}>
                                                        {option ?? "-"}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </section>
    );
};

export default TableAttendance;
