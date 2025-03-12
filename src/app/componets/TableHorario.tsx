'use client'
import { useEffect, useRef } from "react";
import tables from "../css/Table.module.css";

const TableHorario = () => {
  const tableRef = useRef(null);

  const horario = [
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-03-12", clase: "Matemáticas" },
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-03-10", clase: "Ingles" },
    { horaInicio: "9:00", horaFin: "10:00", dia: "2025-03-11", clase: "Proba" },
    { horaInicio: "9:00", horaFin: "11:00", dia: "2025-03-12", clase: "Historia" },
    { horaInicio: "11:00", horaFin: "13:00", dia: "2025-03-13", clase: "Física" },
    { horaInicio: "15:00", horaFin: "17:00", dia: "2025-03-14", clase: "Química" },
    { horaInicio: "18:00", horaFin: "21:00", dia: "2025-03-15", clase: "Arte" },
  ];

  const horas = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`);
  
  const diasMes = Array.from({ length: 20 }, (_, i) => `2025-03-${(i + 1).toString().padStart(2, '0')}`);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = diasMes.indexOf(today);
    if (tableRef.current && todayIndex !== -1) {
      const tableHeaders = tableRef.current.querySelectorAll("thead th");
      if (tableHeaders[todayIndex + 1]) {
        tableHeaders[todayIndex + 7].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  return (
    <section className={tables.TableContainer} ref={tableRef}>
      <div className={tables.box}>
        <table>
          <thead>
            <tr>
              <th className={tables.fixedCol}>Hora</th>
              {diasMes.map((dia, index) => (
                <th key={index}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, index) => (
              <tr key={index} className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>{hora}</td>
                {diasMes.map((dia, j) => {
                  const clase = horario.find((h) => h.dia === dia && h.horaInicio === hora);
                  if (clase) {
                    const horaInicioIndex = horas.indexOf(clase.horaInicio);
                    const horaFinIndex = horas.indexOf(clase.horaFin);
                    const rowSpanValue = horaFinIndex - horaInicioIndex;
                    return (
                      <td key={j} className={tables.classCell} rowSpan={rowSpanValue}>
                        {clase.clase}
                      </td>
                    );
                  }
                  const enRango = horario.find((h) => h.dia === dia && h.horaInicio < hora && h.horaFin > hora);
                  if (enRango) {
                    return null;
                  }
                  return <td key={j}></td>;
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
