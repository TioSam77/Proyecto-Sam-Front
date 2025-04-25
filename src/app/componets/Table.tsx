"use client";
import { useState } from "react";
import tables from "../css/Table.module.css";

import { initialData, initialConfirmedDates, Attendance } from "../data/student";

interface TableProps {
    apiUrl: string;
}

const attendanceOptions: Attendance[] = ["P", "PL", "N", "A", null];


const Table = (props: TableProps) => {
    const [data, setData] = useState(initialData);
    const [confirmedDates, setConfirmedDates] = useState(initialConfirmedDates);
    const [searchTerm, setSearchTerm] = useState("");

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
                        {filteredData.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                <td>{row.id}</td>
                                <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                    {row.name}
                                </td>
                                {Object.keys(initialConfirmedDates).map((date) => (
                                    <td key={date}>
                                        <select
                                            className={tables.select}
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
