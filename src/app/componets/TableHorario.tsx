'use client'
import { useEffect, useRef, useState } from "react";
import tables from "../css/Table.module.css";

const TableHorario = () => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [celdasOcupadas, setCeldasOcupadas] = useState(new Set<string>());

  const horario = [
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-03-12", clase: "Matemáticas aplicadas y computacion" },
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-03-10", clase: "Ingles avanzado casi experto y nativo c2 c3 23o" },
    { horaInicio: "9:00", horaFin: "10:00", dia: "2025-03-11", clase: "Proba" },
    { horaInicio: "9:00", horaFin: "11:00", dia: "2025-03-12", clase: "Historia" },
    { horaInicio: "11:00", horaFin: "13:00", dia: "2025-03-13", clase: "Física" },
    { horaInicio: "15:00", horaFin: "17:00", dia: "2025-03-14", clase: "Química" },
    { horaInicio: "18:00", horaFin: "21:00", dia: "2025-03-15", clase: "Arte" },
    { horaInicio: "12:00", horaFin: "13:00", dia: "2025-03-12", clase: "procesos" },
  ];

  const horas = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`);
  const diasMes = Array.from({ length: 22 }, (_, i) => `2025-03-${(i + 1).toString().padStart(2, '0')}`);

  return (
    <section className={tables.TableContainer} ref={tableRef}>
      <div className={tables.box}>
        <table>
          <thead>
            <tr className={tables.fixedRow}>
              <th className={tables.fixedColRow}>Hora</th>
              {diasMes.map((dia, index) => (
                <th key={index}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                <td className={`${tables.fixedCol} ${rowIndex % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>{hora}</td>
                {diasMes.map((dia, colIndex) => {
                  const key = `${dia}-${hora}`;
                  
                  if (celdasOcupadas.has(key)) return null;

                  const clase = horario.find((h) => h.dia === dia && h.horaInicio === hora);
                  if (clase) {
                    const horaInicioIndex = horas.indexOf(clase.horaInicio);
                    const horaFinIndex = horas.indexOf(clase.horaFin);
                    const rowSpanValue = horaFinIndex - horaInicioIndex;

                    for (let i = 1; i < rowSpanValue; i++) {
                      celdasOcupadas.add(`${dia}-${horas[horaInicioIndex + i]}`);
                    }

                    return (
                      <td key={colIndex} className={tables.classCell} rowSpan={rowSpanValue}>
                        {clase.clase}
                      </td>
                    );
                  }
                  
                  return <td key={colIndex}></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TableHorario;
