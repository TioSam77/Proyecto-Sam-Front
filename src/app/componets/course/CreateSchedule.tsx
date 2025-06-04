'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { isHoliday } from '@/app/hooks/isHoliday';
import styles from '@/app/css/Schedule.module.css';
import stylesLogin from "@/app/css/Login.module.css";
import { envCredentials } from '../../../../firebase/envConfigurations';

const CreateSchedule = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [error, setError] = useState<string | null>("");
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { api } = envCredentials();

  const params = useParams();
  const courseId = params?.id as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");
    setError("");

    const feriado = isHoliday(date);
    if (feriado) {
      setError(`No se pueden agregar días feriados: ${feriado}`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/post-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          date,
          entry_time: startTime,
          exit_time: endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear el horario");
      } else {
        setAlert("Horario creado correctamente");
        setDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
      setError(`Error al crear el horario: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerSchedule}>
      <h2 className={styles.title}>Crear dia de clase</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.labelSchedule}>Fecha</label>
          <input
            type="date"
            className={styles.inputSchedule}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.labelSchedule}>Hora de Entrada</label>
          <input
            type="time"
            className={styles.inputSchedule}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.labelSchedule}>Hora de Salida</label>
          <input
            type="time"
            className={styles.inputSchedule}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.bluebutton}>
            Guardar Horario
          </button>
        </div>
      </form>

      <div className={stylesLogin.messageContainer}>
        {error && <div className={stylesLogin.errorBox}>{error}</div>}
        {alert && <div className={stylesLogin.alertBox}>{alert}</div>}
        {loading && <div className={stylesLogin.loading}>loading</div>}
      </div>
    </div>
  );
};

export default CreateSchedule;