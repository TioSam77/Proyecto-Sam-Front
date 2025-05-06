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
        collection(db, "course_schedule"), // o el nombre que tengas para esa colección
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
  
    const dias = [];
  
    for (let i = 1; i < 7; i++) { 
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
  
      dias.push(dia.toISOString().split('T')[0]); // solo los días de lunes a sábado
    }
  
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
    <div className={tables.classroomContainer}>
    <div className={tables.scheduleBody}>
      {diasSemana.map((dia, idx) => {
        const fecha = new Date(dia);
        const diaSemana = fecha.toLocaleDateString("es-MX", { weekday: "long" });
        const diaNumerico = fecha.toISOString().split("T")[0];
        return (
          <div key={idx} className={tables.dayColumn}>
            <div className={tables.dayColumnHeader}>
              <strong>{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</strong>
              <div>{diaNumerico}</div>
            </div>
            <div className={tables.classList}>
              {horario
                .filter((clase) => clase.dia === dia)
                .map((clase, i) => (
                  <div key={i} className={tables.classBlock}>
                    <div>{clase.name}</div>
                    <div>
                      {clase.horaInicio} - {clase.horaFin}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>  
  );
};

export default TableHorario;
