'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/css/EditStudent.module.css';
import { useParams } from 'next/navigation';
import { getAuth } from 'firebase/auth';

interface StudentData {
  name: string;
  name2: string;
  surname: string;
  surname2: string;
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
    name2: '',
    surname: '',
    surname2: '',
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

  const combineNames = (name: string, name2: string) => [name, name2].filter(Boolean).join(' ');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api-uj4mkoe42a-uc.a.run.app/student/${studentId}`
        );

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setStudentData(data);

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

    fetchStudent();
  }, [studentId]);

  const handleEdit = (field: keyof StudentData) => {
    setEditingField(field);

    if (field === 'name') {
      setTempValue(combineNames(studentData.name, studentData.name2));
    } else if (field === 'surname') {
      setTempValue(combineNames(studentData.surname, studentData.surname2));
    } else {
      setTempValue(studentData[field]);
    }
  };


  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/put-student/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: editingField,
          value: tempValue,
          currentData: studentData, // para usar en el backend si se necesita
        }),
      });

      if (!res.ok) {
        console.log("Error al actualizar");
      }

      const { updatedFields } = await res.json();
      setStudentData((prev) => ({ ...prev, ...updatedFields }));
    } catch (err) {
      console.error("Error al actualizar:", err);
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
        <h3 className={styles.editTitle}>Editar tus datos</h3>
        :
        <h3 className={styles.editTitle}>Editar Información del Alumno</h3>
      }

      {editableFields.map(([field, label]) => {
        const isAuthOnlyField = ['name', 'surname', 'email'].includes(field);
        if (isAuthOnlyField && !isSelf) {
          return (
            <div key={field} className={styles.infoRow}>
              <span className={styles.label}>{label}:</span>
              <div className={styles.value}>
                <span>
                  {field === 'name'
                    ? combineNames(studentData.name, studentData.name2)
                    : field === 'surname'
                      ? combineNames(studentData.surname, studentData.surname2)
                      : studentData[field]
                  }
                </span>
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
