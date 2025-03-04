"use client";
import { useState } from "react";
import styles from "../css/Login.module.css";
import tables from "../css/Table.module.css";

interface TableProps {
    title: string;
    apiUrl: string;
}

interface AttendanceRecord {
    id: number;
    name: string;
    attendance: {
        [date: string]: string | null; // "P", "PL", "N", "A" o null
    };
}

interface ConfirmedDates {
    [date: string]: boolean;
}

const attendanceOptions = ["P", "PL", "N", "A", null];

const initialData: AttendanceRecord[] = [
    { id: 67, name: "Paola", attendance: { "9-jul": "P", "16-jul": "PL", "23-jul": null } },
    { id: 170, name: "Amelia", attendance: { "9-jul": "P", "16-jul": "N", "23-jul": null } },
    { id: 182, name: "Carolina", attendance: { "9-jul": "P", "16-jul": "P", "23-jul": null } },
];

const initialConfirmedDates: ConfirmedDates = {
    "9-jul": true,
    "16-jul": false,
    "23-jul": false,
};

const Table = (props: TableProps) => {
    const [data, setData] = useState(initialData);
    const [confirmedDates, setConfirmedDates] = useState(initialConfirmedDates);

    const handleCellClick = (id: number, date: string) => {
        if (confirmedDates[date]) return; // Evita cambios si el día está confirmado

        setData((prevData) =>
            prevData.map((row) => {
                if (row.id !== id) return row;

                const currentIndex = attendanceOptions.indexOf(row.attendance[date]);
                const nextIndex = (currentIndex + 1) % attendanceOptions.length;
                
                return {
                    ...row,
                    attendance: {
                        ...row.attendance,
                        [date]: attendanceOptions[nextIndex],
                    },
                };
            })
        );
    };

    const confirmColumn = (date: string) => {
        setConfirmedDates((prev) => ({ ...prev, [date]: true }));
    };

    return (
        <section className={tables.TableContainer}>
            <h3 className={styles.welcomeText}>{props.title}</h3>
            <div className={styles.boxWrapper}>
                <div className={styles.borderGradient}></div>
                <div className={tables.box}>
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th className={tables.fixedCol}>Nombre</th>
                                    {Object.keys(initialConfirmedDates).map((date) => (
                                        <th key={date}>
                                            {date}
                                            {!confirmedDates[date] && (
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button
                                                        className={styles.blueButton}
                                                        style={{ border: "1px solid black", maxWidth: "80%", display: "block" }}
                                                        onClick={() => confirmColumn(date)}
                                                    >
                                                        Confirmar
                                                    </button>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td className={tables.fixedCol}>{row.name}</td>
                                        {Object.keys(row.attendance).map((date) => (
                                            <td
                                                key={date}
                                                onClick={() => handleCellClick(row.id, date)}
                                                style={{
                                                    cursor: confirmedDates[date] ? "default" : "pointer",
                                                    backgroundColor:
                                                        row.attendance[date] === "P" ? "lightgreen" :
                                                        row.attendance[date] === "PL" ? "lightblue" :
                                                        row.attendance[date] === "N" ? "lightcoral" :
                                                        row.attendance[date] === "A" ? "gray" : "white",
                                                }}
                                            >
                                                {row.attendance[date] ?? "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Table;
