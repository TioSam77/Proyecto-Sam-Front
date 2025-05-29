'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from '@/app/css/EditProfile.module.css';
import { db } from '@/../firebase/clientApp';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  heardFrom?: string;
  teacherNote?: string;
  role: 'student' | 'teacher' | 'admin';
}

interface Props {
  role: 'student' | 'teacher' | 'admin';
}

const EditProfile = ({ role }: Props) => {
  const params = useParams();
  const userId = params?.id as string;

  const [userData, setUserData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    heardFrom: '',
    teacherNote: '',
    role,
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, role, userId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setNotFound(true);
          return;
        }

        const data = snap.data();
        setUserData({
          name: data.name || '',
          surname: data.surname || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          heardFrom: data.heardFrom || '',
          teacherNote: data.teacherNote || '',
          role,
        });

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
          setIsSelf(true);
        }
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId, role]);

  const handleEdit = (field: keyof UserData) => {
    setEditingField(field);
    setTempValue(userData[field] ?? '');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      const updated = { ...userData, [editingField]: tempValue };
      const ref = doc(db, role, userId);
      await updateDoc(ref, { [editingField]: tempValue });

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === userId) {
        if (editingField === 'email') {
          await updateEmail(user, tempValue);
        } else if (editingField === 'name' || editingField === 'surname') {
          await updateProfile(user, {
            displayName: `${updated.name} ${updated.surname}`,
          });
        }
      }

      setUserData(updated);
    } catch (error) {
      alert('Error al guardar los cambios.');
    } finally {
      setEditingField(null);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (notFound) return <p>No se encontró el perfil.</p>;

  const fieldsByRole: Record<string, [keyof UserData, string][]> = {
    student: [
      ['name', 'Nombre'],
      ['surname', 'Apellido'],
      ['email', 'Correo'],
      ['phoneNumber', 'Teléfono'],
      ['heardFrom', '¿Cómo se enteró?'],
      ['teacherNote', 'Nota del Profesor'],
    ],
    teacher: [
      ['name', 'Nombre'],
      ['surname', 'Apellido'],
      ['email', 'Correo'],
      ['phoneNumber', 'Teléfono'],
    ],
    admin: [
      ['name', 'Nombre'],
      ['surname', 'Apellido'],
      ['email', 'Correo'],
      ['phoneNumber', 'Teléfono'],
    ],
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Editar Perfil ({role})</h2>

      {fieldsByRole[role].map(([field, label]) => (
        <div key={field} className={styles.row}>
          <span className={styles.label}>{label}:</span>
          {editingField === field ? (
            <div className={styles.editZone}>
              <input
                className={styles.input}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button onClick={handleSave} className={styles.save}>
                Guardar
              </button>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancelar
              </button>
            </div>
          ) : (
            <div className={styles.display}>
              <span>{userData[field]}</span>
              <button onClick={() => handleEdit(field)} className={styles.editBtn}>
                <i className="bi bi-pencil-square"></i>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditProfile;
