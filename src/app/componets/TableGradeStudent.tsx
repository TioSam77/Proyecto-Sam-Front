"use client";
import { useState } from "react";
import tables from "../css/Table.module.css";
import { initialData } from "../data/student";

interface TableProps {
    apiUrl: string;
}

interface StudentRecord {
    id: number;
    name: string;
    grade: number | null;
}

const TableGradeStudent = (props: TableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredData = initialData.filter((row) => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={tables.TableContainer}>
            <input
                type="text"
                placeholder="Buscar estudiante..."
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
                            <th>Calificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                                <td>{row.id}</td>
                                <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                    {row.name}
                                </td>
                                <td
                                    style={{
                                        backgroundColor:
                                            row.grade === 10 ? "lightgreen" :
                                            row.grade === 9 ? "lightblue" :
                                            row.grade === 8 ? "#CBC3E3" :
                                            row.grade === 7 ? "lightyellow" :
                                            row.grade === 6 ? "orange" :
                                            row.grade === 5 ? "lightcoral" : "",
                                    }}
                                >
                                    {row.grade ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TableGradeStudent;
