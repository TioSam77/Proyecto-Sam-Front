'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from '@/app/css/EditStudent.module.css';
import { db } from '../../../../firebase/clientApp';
import { useParams } from 'next/navigation';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';

interface AdminData {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: number;
  active: boolean;
}

const EditAdmin = () => {
  const params = useParams();
  const adminId = params?.id as string;

  const [adminData, setAdminData] = useState<AdminData>({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    position: '',
    role: 3,
    active: true
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const adminRef = doc(db, 'teacher', adminId);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          setNotFound(true);
          return;
        }

        const data = adminSnap.data();
        setAdminData({
          name: data.name || '',
          surname: data.surname || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          position: data.position || '',
          role: data.role || 3,
          active: data.active ?? true,
        });

        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.uid === adminId) {
          setIsSelf(true);
        }
      } catch (err) {
        console.error("Error al obtener datos del administrador:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  const handleEdit = (field: keyof AdminData) => {
    setEditingField(field);
    setTempValue(String(adminData[field]));
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSave = async () => {
    if (!editingField) return;

    let value: string | number | boolean = tempValue;
    if (editingField === 'active') {
      value = tempValue === 'true';
    } else if (editingField === 'role') {
      value = parseInt(tempValue);
    }

    const updatedData = { ...adminData, [editingField]: value };

    try {
      const adminRef = doc(db, 'teacher', adminId);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === adminId) {
        if (editingField === 'name' || editingField === 'surname') {
          const newName = editingField === 'name' ? tempValue : adminData.name;
          const newSurname = editingField === 'surname' ? tempValue : adminData.surname;

          await updateProfile(user, {
            displayName: `${newName} ${newSurname}`,
          });
        }

        if (editingField === 'email') {
          await updateEmail(user, tempValue);
        }
      }
      await updateDoc(adminRef, { [editingField]: value });

      setAdminData(updatedData as AdminData);
    } catch (err) {
      alert(`Ocurrió un error al actualizar los datos. ${err}`);
    } finally {
      setEditingField(null);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (notFound) return <p>Administrador no encontrado.</p>;

  const editableFields: [keyof AdminData, string][] = [
    ['name', 'Nombre'],
    ['surname', 'Apellido'],
    ['email', 'Correo'],
    ['phoneNumber', 'Teléfono'],
    ['position', 'Puesto'],
    ['role', 'Rol'],
    ['active', 'Activo']
  ];

  return (
    <div className={styles.editCard}>
      {isSelf ?
        <h3 className={styles.editTitle}>Editar tus datos</h3> :
        <h3 className={styles.editTitle}>Editar Información del Administrador</h3>
      }

      {editableFields.map(([field, label]) => {
        const isAuthOnlyField = ['name', 'surname', 'email'].includes(field);
        if (isAuthOnlyField && !isSelf) {
          return (
            <div key={field} className={styles.infoRow}>
              <span className={styles.label}>{label}:</span>
              <div className={styles.value}>
                <span>
                  {field === 'role'
                    ? adminData.role === 1
                      ? 'Super Administrador'
                      : adminData.role === 2
                        ? 'Administrador'
                        : adminData.role === 3
                          ? 'Profesor Inglés'
                          : 'Rol desconocido'
                    : String(adminData[field])
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
                {field === 'active' ? (
                  <select
                    className={styles.input}
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                ) : field === 'role' ? (
                  <select
                    className={styles.input}
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  >
                    <option value="1">Super Administrador</option>
                    <option value="2">Administrador</option>
                    <option value="3">Profesor Inglés</option>
                    <option value="0" disabled>Seleccione un rol</option>
                  </select>
                ) : (
                  <input
                    className={styles.input}
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
              <div className={styles.value}>
                <span>
                  {field === 'active'
                    ? adminData.active ? 'Activo' : 'Inactivo'
                    : field === 'role'
                      ? adminData.role === 1
                        ? 'Super Administrador'
                        : adminData.role === 2
                          ? 'Administrador'
                          : 'Profesor Inglés'
                      : String(adminData[field])
                  }
                </span>
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

export default EditAdmin;
