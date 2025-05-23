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
  role: string;
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
    role: '',
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
        const adminRef = doc(db, 'admin', adminId);
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
          role: data.role || '',
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

    const value = editingField === 'active' ? tempValue === 'true' : tempValue;
    const updatedData = { ...adminData, [editingField]: value };

    try {
      const adminRef = doc(db, 'admin', adminId);
      await updateDoc(adminRef, { [editingField]: value });

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

      setAdminData(updatedData as AdminData);
    } catch (err) {
      console.error("Error al actualizar el administrador o el perfil de autenticación:", err);
      alert("Ocurrió un error al actualizar los datos.");
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
                <span>{String(adminData[field])}</span>
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
                <span>{field === 'active' ? (adminData.active ? 'Activo' : 'Inactivo') : String(adminData[field])}</span>
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
