'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import styles from '@/app/css/EditTeacher.module.css';
import { db } from '../../../../firebase/clientApp';
import { getAuth, updateEmail, updateProfile, User } from 'firebase/auth';

type Teacher = {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  office: string;
  department: string;
  active: boolean;
};

const EditTeacher = () => {
  const { id } = useParams(); // Obtiene el ID del profesor de la URL
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [editingField, setEditingField] = useState<null | keyof Teacher>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(teacherData[field as keyof typeof teacherData]);
  };

  const handleSave = () => {
    setTeacherData(prev => ({ ...prev, [editingField as string]: tempValue }));
    setEditingField(null);
    setTempValue('');
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
          <button className={styles.editButton} onClick={() => handleEdit(field)}>
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {isSelf ? 'Editar tu información como profesor' : 'Editar Información del Profesor'}
      </h2>
      <div className={styles.teacherInfo}>
        {renderField('Nombre:', 'name')}
        {renderField('Apellido:', 'surname')}
        {renderField('Correo:', 'email')}
        {renderField('Teléfono:', 'phoneNumber')}
        {renderField('Oficina:', 'office')}
        {renderField('Departamento:', 'department')}
        {renderField('Activo:', 'active')}
      </div>
    </div>
  );
};

export default EditTeacher;
