'use client'
import { useRef, useState, useEffect } from "react";
import tables from "../css/Table.module.css";

const TableHorario = () => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [celdasOcupadas, setCeldasOcupadas] = useState(new Set<string>());
  const [diasSemana, setDiasSemana] = useState<string[]>([]);

  const horario = [
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-04-28", clase: "Matemáticas aplicadas y computacion" },
    { horaInicio: "7:00", horaFin: "9:00", dia: "2025-04-29", clase: "Inglés avanzado" },
    { horaInicio: "9:00", horaFin: "10:00", dia: "2025-04-30", clase: "Proba" },
    { horaInicio: "9:00", horaFin: "11:00", dia: "2025-05-01", clase: "Historia" },
    { horaInicio: "11:00", horaFin: "13:00", dia: "2025-05-02", clase: "Física" },
    { horaInicio: "15:00", horaFin: "17:00", dia: "2025-05-03", clase: "Química" },
    { horaInicio: "12:00", horaFin: "13:00", dia: "2025-05-04", clase: "Procesos" },
  ];

  const horas = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`);

  // Calcula los días de esta semana (lunes a domingo)
  const obtenerDiasDeLaSemana = () => {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (domingo) a 6 (sábado)
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((diaActual + 6) % 7)); // obtener lunes

    const dias = Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      return dia.toISOString().split('T')[0]; // formato YYYY-MM-DD
    });

    return dias;
  };

  // Programa recarga el domingo a las 23:00
  useEffect(() => {
    const ahora = new Date();
    const proximoDomingo = new Date(ahora);
    proximoDomingo.setDate(ahora.getDate() + (7 - ahora.getDay()) % 7); // próximo domingo
    proximoDomingo.setHours(23, 0, 0, 0); // 23:00:00

    const msHastaDomingo = proximoDomingo.getTime() - ahora.getTime();

    const timeout = setTimeout(() => {
      window.location.reload();
    }, msHastaDomingo);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setDiasSemana(obtenerDiasDeLaSemana());
  }, []);

  return (
    <section className={tables.TableContainer} ref={tableRef}>
      <div className={tables.box}>
        <table>
          <thead>
            <tr className={tables.fixedRow}>
              <th className={tables.fixedColRow}>Hora</th>
              {diasSemana.map((dia, index) => (
                <th key={index}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? tables["row-even"] : tables["row-odd"]}>
                <td className={`${tables.fixedCol} ${rowIndex % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>{hora}</td>
                {diasSemana.map((dia, colIndex) => {
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
