'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';

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
    <div className="">
      <h2 className="">Crear Dia de clases</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="">Fecha</label>
          <input
            type="date"
            className=""
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="">Hora de Entrada</label>
          <input
            type="time"
            className=""
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="">Hora de Salida</label>
          <input
            type="time"
            className=""
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bluebutton"
        >
          Guardar Horario
        </button>
      </form>
    </div>
  );
};

export default CreateSchedule;
