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
  surname: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: number;
  active: boolean;
};

const EditTeacher = () => {
  const { id } = useParams() as { id: string };
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [editingField, setEditingField] = useState<null | keyof Teacher>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false); // ← Solo el propietario puede editar
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // <-- Guardamos el rol del usuario actual

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const docRef = doc(db, 'teacher', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Teacher;
          setTeacherData(data);
        } else {
          console.error('No se encontró el empleado');
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          setIsSelf(user.uid === id);

          const tokenResult = await user.getIdTokenResult();
          const roleFromToken = tokenResult.claims.role;

          if (typeof roleFromToken === 'string') {
            setCurrentUserRole(roleFromToken);
          } else {
            setCurrentUserRole(null);
          }
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

    let newValue: string | number | boolean = tempValue;

    if (editingField === 'active') {
      newValue = tempValue === 'true';
    } else if (editingField === 'role') {
      const parsed = Number(tempValue);
      if (isNaN(parsed)) {
        alert('El valor del rol debe ser un número válido.');
        return;
      }
      newValue = parsed;
    }

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
    const isSensitive = ['name', 'surname', 'email'].includes(field);

    if (field === 'role') {
      const roleName = value === 1
        ? 'Super Administrador'
        : value === 2
          ? 'Administrador'
          : value === 3
            ? 'Profesor Inglés'
            : 'Rol desconocido';

      return (
        <div className={styles.infoRow} key={field}>
          <span className={styles.label}>{label}</span>
          {editingField === field ? (
            <div className={styles.editingArea}>
              <select
                className={styles.inputField}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
              >
                <option value="0" disabled>Seleccione un rol</option>
                <option value="1">Super Administrador</option>
                <option value="2">Administrador</option>
                <option value="3">Profesor Inglés</option>
              </select>
              <div className={styles.actions}>
                <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className={styles.displayArea}>
              <span className={styles.value}>{roleName}</span>
              {currentUserRole === 'superAdmin' && (
                <button className={styles.editButton} onClick={() => handleEdit(field)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }


    // Resto del render para otros campos (igual que antes)...
    const displayValue = field === 'active'
      ? (value === true || value === 'true' ? 'Activo' : 'Inactivo')
      : String(value);

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
            <span className={styles.value}>{displayValue}</span>
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
        {renderField('Rol:', 'role')}
        {renderField('Activo:', 'active')}
      </div>
    </div>
  );
};

export default EditTeacher;
