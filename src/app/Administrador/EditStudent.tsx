'use client';

import React, { useState } from 'react';
import styles from '@/app/css/EditStudent.module.css';

interface StudentData {
  name: string;
  email: string;
}

const EditStudent = () => {
  // 🔧 Datos simulados (reemplazar con datos reales luego)
  const [studentData, setStudentData] = useState<StudentData>({
    name: 'Juan Pérez',
    email: 'juanperez@email.com',
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: keyof StudentData) => {
    setEditingField(field);
    setTempValue(studentData[field]);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSave = () => {
    if (editingField) {
      setStudentData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      setEditingField(null);
    }
  };

  return (
    <div className={styles.editCard}>
      <h2 className={styles.editTitle}>Editar Información del Alumno</h2>

        {/* Campo: Nombre */}
        <div className={styles.infoRow}>
        <span className={styles.label}>Nombre:</span>
        {editingField === 'name' ? (
            <div className={styles.value}>
            <input
                className={styles.input}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
            />
            <div className={styles.actions}>
                <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
            </div>
            </div>
        ) : (
            <div className={styles.value}>
            <span>{studentData.name}</span>
            <button className={styles.editButton} onClick={() => handleEdit('name')}>✏️</button>
            </div>
        )}
        </div>

        {/* Campo: Correo */}
        <div className={styles.infoRow}>
        <span className={styles.label}>Correo:</span>
        {editingField === 'email' ? (
            <div className={styles.value}>
            <input
                className={styles.input}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
            />
            <div className={styles.actions}>
                <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
            </div>
            </div>
        ) : (
            <div className={styles.value}>
            <span>{studentData.email}</span>
            <button className={styles.editButton} onClick={() => handleEdit('email')}>✏️</button>
            </div>
        )}
        </div>
    </div>
  );
};

export default EditStudent;
