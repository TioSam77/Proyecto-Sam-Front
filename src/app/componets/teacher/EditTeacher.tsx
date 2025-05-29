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
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';

type Teacher = {
  name: string;
  name2: string;
  surname: string;
  surname2: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: number;
  active: boolean;
};

const EditTeacher = () => {
  const { id } = useParams() as { id: string };
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [editingField, setEditingField] = useState<keyof Teacher | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/teacher/${id}`);
        if (!res.ok) {
          console.error("No se encontró el empleado");
          return;
        }

        const data: Teacher = await res.json();
        setTeacherData(data);

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          setIsSelf(user.uid === id);

          const tokenResult = await user.getIdTokenResult();
          const roleFromToken = tokenResult.claims.role;
          setCurrentUserRole(typeof roleFromToken === "string" ? roleFromToken : null);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
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

    if (field === 'role' && currentUserRole !== 'superAdmin') {
      alert('No tienes permiso para modificar el rol.');
      return;
    }

    setEditingField(field);
    const value = teacherData?.[field];
    setTempValue(value?.toString() || '');
  };

  const handleSave = async () => {
    if (!editingField || !teacherData) return;

    let updates: Partial<Teacher> = {};

    switch (editingField) {
      case 'name': {
        const [name, ...name2Parts] = tempValue.trim().split(' ');
        updates.name = name;
        updates.name2 = name2Parts.join(' ');
        break;
      }
      case 'surname': {
        const [surname, ...surname2Parts] = tempValue.trim().split(' ');
        updates.surname = surname;
        updates.surname2 = surname2Parts.join(' ');
        break;
      }
      case 'active': {
        updates.active = tempValue === 'true';
        break;
      }
      case 'role': {
        const parsed = Number(tempValue);
        if (isNaN(parsed)) {
          alert('El valor del rol debe ser un número válido.');
          return;
        }
        updates.role = parsed;
        break;
      }
      default: {
        // Aquí TS infiere que es una clave que no sea name/surname/active/role
        updates[editingField] = tempValue as string;
        break;
      }
    }

    try {
      const docRef = doc(db, 'teacher', id);
      await updateDoc(docRef, updates);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === id) {
        if (editingField === 'name' || editingField === 'surname') {
          const newName = updates.name ?? teacherData.name;
          const newSurname = updates.surname ?? teacherData.surname;
          await updateProfile(user, {
            displayName: `${newSurname} ${newName}`,
          });
        }
        if (editingField === 'email') {
          await updateEmail(user, tempValue);
        }
      }

      setTeacherData({ ...teacherData, ...updates });
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

    let value: string | number | boolean = teacherData[field];
    let displayValue: string;

    if (field === 'name') {
      displayValue = `${teacherData.name} ${teacherData.name2}`.trim();
    } else if (field === 'surname') {
      displayValue = `${teacherData.surname} ${teacherData.surname2}`.trim();
    } else if (field === 'active') {
      displayValue = value === true || value === 'true' ? 'Activo' : 'Inactivo';
    } else if (field === 'role') {
      displayValue = value === 1
        ? 'Super Administrador'
        : value === 2
          ? 'Administrador'
          : value === 3
            ? 'Profesor Inglés'
            : 'Rol desconocido';
    } else {
      displayValue = String(value);
    }

    const isSensitive = ['name', 'surname', 'email'].includes(field);

    return (
      <div className={styles.infoRow} key={field}>
        <span className={styles.label}>{label}</span>
        {editingField === field ? (
          <div className={styles.editingArea}>
            {field === 'active' || field === 'role' ? (
              <select
                className={styles.inputField}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
              >
                {field === 'active' ? (
                  <>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </>
                ) : (
                  <>
                    <option value="1">Super Administrador</option>
                    <option value="2">Administrador</option>
                    <option value="3">Profesor Inglés</option>
                  </>
                )}
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
            <span className={styles.value}>{displayValue}</span>
            {(field === 'role'
              ? currentUserRole === 'superAdmin'
              : (!isSensitive || isSelf)) && (
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
        {renderField('Nombre completo:', 'name')}
        {renderField('Apellidos completos:', 'surname')}
        {renderField('Correo:', 'email')}
        {renderField('Teléfono:', 'phoneNumber')}
        {renderField('Puesto:', 'position')}
        {renderField('Rol:', 'role')}
        {renderField('Activo:', 'active')}
      </div>
    </div>
  );
};

export default EditTeacher;
