'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/css/EditSchedule.module.css';

interface Schedule {
  id: string;
  datetime: string; // formato: "YYYY-MM-DDTHH:MM"
}

const EditSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos simulados con fecha y hora
    const fakeData: Schedule[] = [
      { id: '1', datetime: '2025-05-27T10:00' },
      { id: '2', datetime: '2025-05-28T14:30' },
      { id: '3', datetime: '2025-05-29T08:15' },
    ];
    setSchedules(fakeData);
    setLoading(false);
  }, []);

  const handleUpdate = () => {
    if (!editId || !newDateTime) return;

    const updated = schedules.map((s) =>
      s.id === editId ? { ...s, datetime: newDateTime } : s
    );
    setSchedules(updated);
    setEditId(null);
    setNewDateTime('');
  };

  const formatReadable = (datetime: string) => {
    const dateObj = new Date(datetime);
    return dateObj.toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className={styles.containerEdit}>
      <h2 className={styles.titleEdit}>Editar Horarios (con Hora)</h2>

      {loading ? (
        <p className={styles.message}>Cargando horarios...</p>
      ) : schedules.length === 0 ? (
        <p className={styles.message}>No hay horarios registrados.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Fecha y Hora Actual</th>
                <th>Nuevo Valor</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td>{formatReadable(s.datetime)}</td>
                  <td>
                    {editId === s.id ? (
                      <input
                        type="datetime-local"
                        value={newDateTime}
                        onChange={(e) => setNewDateTime(e.target.value)}
                        className={styles.inputDate}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {editId === s.id ? (
                      <button className={styles.saveButton} onClick={handleUpdate}>
                        Guardar
                      </button>
                    ) : (
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setEditId(s.id);
                          setNewDateTime(s.datetime);
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditSchedule;
