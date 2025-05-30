'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/css/EditSchedule.module.css';

interface Schedule {
  id: string;
  datetime: string;   // '2025-05-27'
  entry_time: string; // '09:00'
  exit_time: string;  // '11:00'
}

const EditSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');        // para editar fecha
  const [newEntryTime, setNewEntryTime] = useState('');  // para editar hora entrada
  const [newExitTime, setNewExitTime] = useState('');    // para editar hora salida
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos simulados con fecha y hora
    const fakeData: Schedule[] = [
      { id: '1', datetime: '2025-05-27', entry_time: '09:00', exit_time: '11:00' },
      { id: '2', datetime: '2025-05-28', entry_time: '09:00', exit_time: '11:00' },
      { id: '3', datetime: '2025-05-29', entry_time: '09:00', exit_time: '11:00' },
    ];
    setSchedules(fakeData);
    setLoading(false);
  }, []);

  const handleEditClick = (schedule: Schedule) => {
    setEditId(schedule.id);
    setNewDate(schedule.datetime);
    setNewEntryTime(schedule.entry_time);
    setNewExitTime(schedule.exit_time);
  };

  const handleUpdate = () => {
    if (!editId || !newDate || !newEntryTime || !newExitTime) return;

    const updated = schedules.map((s) =>
      s.id === editId
        ? { ...s, datetime: newDate, entry_time: newEntryTime, exit_time: newExitTime }
        : s
    );
    setSchedules(updated);
    setEditId(null);
    setNewDate('');
    setNewEntryTime('');
    setNewExitTime('');
  };

  const formatReadable = (schedule: Schedule) => {
    return `${schedule.datetime} ${schedule.entry_time} - ${schedule.exit_time}`;
  };

  return (
    <div className={styles.containerEdit}>
      <h2 className={styles.titleEdit}>Editar Horarios</h2>

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
                <th>Editar Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td>{formatReadable(s)}</td>

                  <td>
                    <div>

                      {editId === s.id ? (
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className={styles.inputDate}
                        />
                      ) : (
                        '-'
                      )}
                    </div>

                    {editId === s.id ? (
                      <input
                        type="time"
                        value={newEntryTime}
                        onChange={(e) => setNewEntryTime(e.target.value)}
                        className={styles.inputTime}
                      />
                    ) : (
                      '-'
                    )}

                    {editId === s.id ? (
                      <input
                        type="time"
                        value={newExitTime}
                        onChange={(e) => setNewExitTime(e.target.value)}
                        className={styles.inputTime}
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
                      <button className="bluebutton" onClick={() => handleEditClick(s)}>
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
