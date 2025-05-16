'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/css/DeleteSubjects.module.css';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase/clientApp';

interface Subject {
  id: string;
  name: string;
}

const DeleteSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subject'));
      const data = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        name: docSnap.data().name || 'Sin nombre',
      }));
      setSubjects(data);
    } catch (error) {
      console.error('Error al obtener las materias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'subject', id));
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (error) {
      console.error('Error al eliminar la materia:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className={styles.containerDelete}>
      <h2 className={styles.titleDelete}>Eliminar Materias</h2>

      {loading ? (
        <p className={styles.message}>Cargando materias...</p>
      ) : subjects.length === 0 ? (
        <p className={styles.message}>No hay materias registradas.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.subjectTable}>
            <thead>
              <tr>
                <th>Materia</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className={styles.deleteButton}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeleteSubjects;