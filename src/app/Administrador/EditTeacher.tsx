'use client';

import React, { useState } from 'react';
import styles from '@/app/css/EditTeacher.module.css'; // Asegúrate de tener este archivo

// Datos simulados, se reemplazarán por Firebase más adelante
const initialData = {
  name: 'María García',
  email: 'maria@correo.com',
  phoneNumber: '+506 1234-5678',
  office: 'Edificio A-105',
  department: 'Matemáticas'
};

const EditTeacher = () => {
  const [teacherData, setTeacherData] = useState(initialData);
  const [editingField, setEditingField] = useState<null | string>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(teacherData[field as keyof typeof teacherData]);
  };

  const handleSave = () => {
    setTeacherData(prev => ({ ...prev, [editingField as string]: tempValue }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const renderField = (label: string, field: string) => (
    <div className={styles.infoRow} key={field}>
      <span className={styles.label}>{label}</span>
      {editingField === field ? (
        <div className={styles.editingArea}>
          <input
            className={styles.inputField}
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className={styles.displayArea}>
          <span className={styles.value}>{teacherData[field as keyof typeof teacherData]}</span>
          <button className={styles.editButton} onClick={() => handleEdit(field)}>✏️</button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Editar Información del Profesor</h2>
      <div className={styles.teacherInfo}>
        {renderField('Nombre:', 'name')}
        {renderField('Correo:', 'email')}
        {renderField('Teléfono:', 'phoneNumber')}
        {renderField('Oficina:', 'office')}
        {renderField('Departamento:', 'department')}
      </div>
    </div>
  );
};

export default EditTeacher;
