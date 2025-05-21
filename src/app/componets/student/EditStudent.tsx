'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from '@/app/css/EditStudent.module.css';
import { db } from '../../../../firebase/clientApp';
import { useParams } from 'next/navigation';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';

interface StudentData {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  heardFrom: string;
  teacherNote: string;
}

const EditStudent = () => {
  const params = useParams();
  const studentId = params?.id as string;

  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    heardFrom: '',
    teacherNote: '',
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSelf, setIsSelf] = useState(false); // ← para verificar si el usuario autenticado es el mismo

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const studentRef = doc(db, 'student', studentId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setNotFound(true);
          return;
        }

        const data = studentSnap.data();
        setStudentData({
          name: data.name || '',
          surname: data.surname || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          heardFrom: data.heardFrom || '',
          teacherNote: data.teacherNote || '',
        });

        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.uid === studentId) {
          setIsSelf(true);
        }
      } catch (err) {
        console.error("Error al obtener datos del estudiante:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  const handleEdit = (field: keyof StudentData) => {
    setEditingField(field);
    setTempValue(studentData[field]);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSave = async () => {
    if (!editingField) return;

    const updatedData = { ...studentData, [editingField]: tempValue };

    try {
      const studentRef = doc(db, 'student', studentId);
      await updateDoc(studentRef, { [editingField]: tempValue });

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === studentId) {
        if (editingField === 'name' || editingField === 'surname') {
          const newName = editingField === 'name' ? tempValue : studentData.name;
          const newSurname = editingField === 'surname' ? tempValue : studentData.surname;

          await updateProfile(user, {
            displayName: `${newName} ${newSurname}`,
          });
        }

        if (editingField === 'email') {
          await updateEmail(user, tempValue);
        }
      }

      setStudentData(updatedData);
    } catch (err) {
      console.error("Error al actualizar el estudiante o el perfil de autenticación:", err);
      alert("Ocurrió un error al actualizar los datos.");
    } finally {
      setEditingField(null);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (notFound) return <p>Estudiante no encontrado.</p>;

  const editableFields: [keyof StudentData, string][] = [
    ['name', 'Nombre'],
    ['surname', 'Apellido'],
    ['email', 'Correo'],
    ['phoneNumber', 'Teléfono'],
    ['heardFrom', '¿Cómo se enteró?'],
    ['teacherNote', 'Nota del Profesor'],
  ];

  return (
    <div className={styles.editCard}>
      {isSelf ? 
      <h3 className='welcomeText'>Editar tus datos</h3>
      :
      <h3 className='welcomeText'>Editar Información del Alumno</h3>
      }

      {editableFields.map(([field, label]) => {
        const isAuthOnlyField = ['name', 'surname', 'email'].includes(field);
        if (isAuthOnlyField && !isSelf) {
          return (
            <div key={field} className={styles.infoRow}>
              <span className={styles.label}>{label}:</span>
              <div className={styles.value}>
                <span>{studentData[field]}</span>
              </div>
            </div>
          );
        }

        return (
          <div key={field} className={styles.infoRow}>
            <span className={styles.label}>{label}:</span>
            {editingField === field ? (
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
                <span>{studentData[field]}</span>
                <button className={styles.editButton} onClick={() => handleEdit(field)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EditStudent;
