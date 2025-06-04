'use client'
import { useState, useEffect } from "react";
import tables from "@/app/css/Table.module.css";
import { useParams } from "next/navigation";
import { envCredentials } from "../../../../firebase/envConfigurations";

interface horario {
  dia: string,
  clase: string,
  horaFin: string,
  horaInicio: string
}

const TableHorario = () => {
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [horario, setHorario] = useState<horario[]>([]);
  const { api } = envCredentials();


  const params = useParams();
  const courseId = params?.id as string;

  useEffect(() => {
    const obtenerFechas = async () => {
      try {
        const res = await fetch(`${api}/get-courseSchedule/${courseId}`);
        if (!res.ok) throw new Error("Error al obtener horarios");

        const datos = await res.json();
        setHorario(datos);
      } catch (error) {
        console.error("Error al obtener fechas:", error);
      }
    };

    if (courseId) {
      obtenerFechas();
    }
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
