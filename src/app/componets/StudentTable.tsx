"use client";
"use client";
import { useState } from "react";
import tables from "../css/Table.module.css";
import { initialData, initialConfirmedDates } from "../data/student";

type Attendance = "P" | "PL" | "N" | "A" | null;

const StudentTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = initialData.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const confirmedDates = Object.keys(initialConfirmedDates).filter((date) => initialConfirmedDates[date]);

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
                            {confirmedDates.map((date) => (
                                <th key={date}>{date}</th>
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
                                {confirmedDates.map((date) => (
                                    <td key={date} style={{
                                        backgroundColor:
                                            row.attendance[date] === "P" ? "lightgreen" :
                                            row.attendance[date] === "PL" ? "lightblue" :
                                            row.attendance[date] === "N" ? "#CBC3E3" :
                                            row.attendance[date] === "A" ? "lightcoral" : "",
                                    }}>
                                        {row.attendance[date] ?? "-"}
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

export default StudentTable;
