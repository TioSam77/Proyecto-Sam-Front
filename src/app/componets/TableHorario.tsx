'use client'
import { useRef, useState, useEffect } from "react";
import tables from "../css/Table.module.css";
import { usePathname } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

const TableHorario = () => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [celdasOcupadas, setCeldasOcupadas] = useState(new Set<string>());
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [horario, setHorario] = useState<any[]>([]);

  const pathname = usePathname();
  const isAdmin = pathname.includes("/Administrador")
  const segments = pathname.split('/');
  let courseId: string = ""
  isAdmin ? courseId = segments[3] : courseId = segments[2]
  
  useEffect(() => {
    const obtenerFechas = async () => {
      const q = query(
        collection(db, "asistencias"), // o el nombre que tengas para esa colección
        where("course_id", "==", courseId),
      );
  
      const snapshot = await getDocs(q);
  
      const datos = snapshot.docs.map(doc => {
        const data = doc.data();
        const fecha = data.date.toDate(); // convierte Timestamp a Date
  
        return {
          dia: fecha.toISOString().split("T")[0], // YYYY-MM-DD
          horaInicio: data.entry_time,
          horaFin: data.exit_time,
          clase: data.name,
        };
      });
  
      setHorario(datos);
    };
  
    obtenerFechas();
  }, [courseId]);
  

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
