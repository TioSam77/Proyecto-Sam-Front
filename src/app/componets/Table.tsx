"use client";
import { useState } from "react";
import tables from "../css/Table.module.css";

interface TableProps {
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
    { id: 123, name: "Jorge", attendance: { "9-jul": "N", "16-jul": "P", "23-jul": null } },
    { id: 56, name: "Erick", attendance: { "9-jul": "PL", "16-jul": "P", "23-jul": null } },
    { id: 567, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 356, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 234, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 5, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 7, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 787, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 53, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 52, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 54, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },
    { id: 64, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null } },

];

const initialConfirmedDates: ConfirmedDates = {
    "9-jul": true,
    "16-jul": false,
    "23-jul": true,
    "24-jul": false,
    "25-jul": false,
    "26-jul": false,
    "27-jul": false,
    "28-jul": false,
    "29-jul": false,
    "30-jul": false,
    "31-jul": false,
    "32-jul": false,
    "33-ago": false,
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
            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th>Código</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            {Object.keys(initialConfirmedDates).map((date) => (
                                <th key={date}>
                                    {date}
                                    {!confirmedDates[date] && (
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
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                <td>{row.id}</td>
                                <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                    {row.name}
                                </td>
                                {Object.keys(initialConfirmedDates).map((date) => (
                                    <td key={date}>
                                        <select
                                            value={row.attendance[date] ?? ""}
                                            onChange={(e) => handleSelectionChange(row.id, date, e.target.value as Attendance)}
                                            disabled={confirmedDates[date]}
                                            style={{
                                                backgroundColor:
                                                    row.attendance[date] === "P" ? "lightgreen" :
                                                    row.attendance[date] === "PL" ? "lightblue" :
                                                    row.attendance[date] === "N" ? "#CBC3E3" :
                                                    row.attendance[date] === "A" ? "lightcoral" : "",
                                                cursor: confirmedDates[date] ? "default" : "pointer"
                                            }}
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
        </section>
    );
};

export default Table;
