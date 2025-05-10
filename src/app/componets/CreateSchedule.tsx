'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import styles from '../css/Schedule.module.css';

const CreateSchedule = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const courseId = pathParts[3];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Obtener el nombre del curso
      const courseRef = doc(db, 'course', courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        alert('El curso no existe');
        return;
      }

      const subjectName = courseSnap.data()?.subject_name || 'Sin nombre';

      await addDoc(collection(db, 'course_schedule'), {
        course_id: courseId,
        date: date,
        entry_time:startTime,
        exit_time:endTime,
        name: subjectName,
      });

      alert('Horario creado correctamente');
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error al crear el horario:', error);
      alert('Ocurrió un error al guardar el horario');
    }
  };

  return (
    <div className={styles.containerSchedule}>
      <h2 className={styles.title}>Crear Día de Clases</h2>
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
    </div>
  );  
};

export default CreateSchedule;
