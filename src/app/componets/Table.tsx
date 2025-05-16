"use client";
import { useState } from "react";
import styles from "../css/Login.module.css";
import tables from "../css/Table.module.css";

interface TableProps {
    title: string;
    apiUrl: string;
}

type Attendance = "P" | "PL" | "N" | "A" | null;

interface AttendanceRecord {
    id: number;
    name: string;
    attendance: {
        [date: string]: Attendance;
    };
}

interface ConfirmedDates {
    [date: string]: boolean;
}

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];

const initialData: AttendanceRecord[] = [
    { id: 67, name: "Paola", attendance: { "9-jul": "P", "16-jul": "PL", "23-jul": null } },
    { id: 170, name: "Amelia", attendance: { "9-jul": "P", "16-jul": "N", "23-jul": null } },
    { id: 182, name: "Carolina", attendance: { "9-jul": "P", "16-jul": "P", "23-jul": null } },

];

const initialConfirmedDates: ConfirmedDates = {
    "9-jul": true,
    "16-jul": false,
    "23-jul": false,
    "24-jul": false,

};


const Table = (props: TableProps) => {
    const [data, setData] = useState(initialData);
    const [confirmedDates, setConfirmedDates] = useState(initialConfirmedDates);

    const handleSelectionChange = (id: number, date: string, value: Attendance) => {
        if (confirmedDates[date]) return;

        setData((prevData) =>
            prevData.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          attendance: {
                              ...row.attendance,
                              [date]: value,
                          },
                      }
                    : row
            )
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
                                                        style={{ border: "1px solid black", display: "block" }}
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
                                                style={{
                                                    textAlign: "center",
                                                    backgroundColor:
                                                        row.attendance[date] === "P" ? "lightgreen" :
                                                        row.attendance[date] === "PL" ? "lightblue" :
                                                        row.attendance[date] === "N" ? "#CBC3E3" :
                                                        row.attendance[date] === "A" ? "lightcoral" : "white",
                                                }}
                                            >
                                                <select
                                                    value={row.attendance[date] ?? ""}
                                                    onChange={(e) => handleSelectionChange(row.id, date, e.target.value as Attendance)}
                                                    disabled={confirmedDates[date]}
                                                    style={{ cursor: confirmedDates[date] ? "default" : "pointer"}}
                                                >
                                                    {attendanceOptions.map((option) => (
                                                        <option key={option} value={option ?? ""}>
                                                            {option ?? "-"}
                                                        </option>
                                                    ))}
                                                </select>
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
