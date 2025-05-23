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
  position: string;
  rol: string;
  active: boolean;
};

const EditTeacher = () => {
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [editingField, setEditingField] = useState<null | keyof Teacher>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false); // ← Solo el propietario puede editar

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
          console.error('No se encontró el empleado');
        }

        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.uid === id) {
          setIsSelf(true);
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
    const sensitive = ['name', 'surname', 'email'].includes(field);
    if (sensitive && !isSelf) {
      alert("No tienes permiso para editar este campo.");
      return;
    }

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

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === id) {
        if (editingField === 'name' || editingField === 'surname') {
          const newName = editingField === 'name' ? tempValue : teacherData.name;
          const newSurname = editingField === 'surname' ? tempValue : teacherData.surname;

          await updateProfile(user, {
            displayName: `${newName} ${newSurname}`,
          });
        }

        if (editingField === 'email') {
          await updateEmail(user, tempValue);
        }
      }

      setTeacherData(updatedData);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al actualizar los datos.');
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
    const isSensitive = ['name', 'surname', 'email', 'position', 'rol'].includes(field);

    return (
      <div className={styles.infoRow} key={field}>
        <span className={styles.label}>{label}</span>
        {editingField === field ? (
          <div className={styles.editingArea}>
            {field === 'active' ? (
              <select
                className={styles.inputField}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
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
              {field === 'active'
                ? value === true || value === 'true'
                  ? 'Activo'
                  : 'Inactivo'
                : value}
            </span>
            {(!isSensitive || isSelf) && (
              <button className={styles.editButton} onClick={() => handleEdit(field)}>
                <i className="bi bi-pencil-square"></i>
              </button>
            )}
          </div>
        )}

      </div>
    );
  };

  if (loading) return <p className={styles.loading}>Cargando datos...</p>;
  if (!teacherData) return <p className={styles.error}>No se encontró el empleado.</p>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {isSelf ? 'Editar tu información de Empleado' : 'Editar Información del Empleado'}
      </h2>
      <div className={styles.teacherInfo}>
        {renderField('Nombre:', 'name')}
        {renderField('Apellido:', 'surname')}
        {renderField('Correo:', 'email')}
        {renderField('Teléfono:', 'phoneNumber')}
        {renderField('Puesto:', 'position')}
        {renderField('Rol:', 'rol')}
        {renderField('Activo:', 'active')}
      </div>
    </div>
  );
};

export default EditTeacher;
