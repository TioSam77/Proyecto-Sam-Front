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
  const [loading, setLoading] = useState(true);

  // Cargar datos del profesor
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const docRef = doc(db, 'teacher', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Teacher;
          setTeacherData(data);
        } else {
          console.error('No se encontró el profesor');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleEdit = (field: keyof Teacher) => {
    setEditingField(field);
    const value = teacherData?.[field];
    setTempValue(typeof value === 'boolean' ? value.toString() : (value || ''));
  };

  const handleSave = async () => {
    if (!editingField || !teacherData) return;

    const originalValue = teacherData[editingField];
    const newValue =
      typeof originalValue === 'boolean' ? tempValue === 'true' : tempValue;

    const updatedData = {
      ...teacherData,
      [editingField]: newValue,
    };

    try {
      const docRef = doc(db, 'teacher', id as string);
      await updateDoc(docRef, {
        [editingField]: newValue,
      });
      setTeacherData(updatedData);
    } catch (error) {
      console.error('Error al guardar:', error);
    }

    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const renderField = (label: string, field: keyof Teacher) => {
    if (!teacherData) return null;
    const value = teacherData[field];

    return (
      <div className={styles.infoRow} key={field}>
        <span className={styles.label}>{label}</span>
        {editingField === field ? (
          <div className={styles.editingArea}>
            {typeof value === 'boolean' ? (
              <select
                className={styles.inputField}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            ) : (
              <input
                className={styles.inputField}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
              />
            )}
            <div className={styles.actions}>
              <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
              <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className={styles.displayArea}>
            <span className={styles.value}>
              {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
            </span>
            <button className={styles.editButton} onClick={() => handleEdit(field)}>
              <i className="bi bi-pencil-square"></i>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <p className={styles.loading}>Cargando datos...</p>;
  if (!teacherData) return <p className={styles.error}>No se encontró el profesor.</p>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Editar Información del Profesor</h2>
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
