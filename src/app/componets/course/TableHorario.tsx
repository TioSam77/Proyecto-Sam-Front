'use client'
import { useState, useEffect } from "react";
import tables from "@/app/css/Table.module.css";
import { usePathname } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/clientApp";

interface horario {
  dia: string,
  clase: string,
  horaFin: string,
  horaInicio: string
}

const TableHorario = () => {
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [horario, setHorario] = useState<horario[]>([]);

  const pathname = usePathname();
  const isAdmin = pathname.includes("/Administrador")
  const segments = pathname.split('/');
  const courseId: string = isAdmin ? segments[3] : segments[2];

  useEffect(() => {
    const obtenerFechas = async () => {
      const q = query(
        collection(db, "course_schedule"), // o el nombre que tengas para esa colección
        where("course_id", "==", courseId),
      );

      const snapshot = await getDocs(q);

      const datos = snapshot.docs.map(doc => {
        const data = doc.data();
        const fecha = data.date;

        return {
          dia: fecha,
          horaInicio: data.entry_time,
          horaFin: data.exit_time,
          clase: data.name,
        };
      });

      setHorario(datos);
    };

    obtenerFechas();
  }, [courseId]);

  const formatearFechaLocal = (fecha: Date) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Calcula los días de esta semana (lunes a domingo)
  const obtenerDiasDeLaSemana = () => {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (domingo) a 6 (sábado)
    const diferencia = diaActual === 0 ? -6 : 1 - diaActual;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diferencia);

    const dias = [];

    for (let i = 0; i < 6; i++) { // Lunes a sábado
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      dias.push(formatearFechaLocal(dia));
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
          const fecha = new Date(dia + "T00:00:00"); // fuerza horario local
          const diaSemana = fecha.toLocaleDateString("es-MX", { weekday: "long" });
          const diaNumerico = formatearFechaLocal(fecha); // en local

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
                      <div>{clase.clase}</div>
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
