'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import styles from '../css/Schedule.module.css';

import stylesLogin from "@/app/css/Login.module.css";

const CreateSchedule = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [error, setError] = useState<string | null>("");
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const courseId = (pathParts[1] === "Profesor" ? pathParts[2] : pathParts[3]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    setAlert("")
    setError("")
    e.preventDefault();

    try {
      // Obtener el nombre del curso
      const courseRef = doc(db, 'course', courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        setError('El curso no existe');
        setLoading(false)
        return;
      }

      const subjectName = courseSnap.data()?.subject_name || 'Sin nombre';

      await addDoc(collection(db, 'course_schedule'), {
        course_id: courseId,
        date: date,
        entry_time: startTime,
        exit_time: endTime,
        name: subjectName,
      });

      setAlert('Horario creado correctamente');
      setDate('');
      setStartTime('');
      setEndTime('');
      setLoading(false)
    } catch (error) {
      setError(`Error al crear el horario: ${error}`);
      setLoading(false)
    }
  };

  return (
    <div className={styles.containerSchedule}>
      <h2 className={styles.title}>Crear un de clases</h2>
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
