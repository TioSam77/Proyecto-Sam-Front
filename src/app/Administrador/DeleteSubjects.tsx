'use client';

import React, { useEffect, useState } from 'react';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../../../firebase/clientApp';
import styles from '../css/DeleteSubjects.module.css'; // Usa un estilo ya existente o reemplaza por uno nuevo

interface Subject {
  id: string;
  name: string;
}

const DeleteSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Simulación temporal SIN conexión a Firebase
  const fetchSubjects = async () => {
    setTimeout(() => {
      setSubjects([
        { id: '1', name: 'Inglés' },
        { id: '2', name: 'Matemáticas' },
        { id: '3', name: 'Física' },
        { id: '4', name: 'Programación' }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleDelete = async (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  // ✅ Código real (descomentar cuando Firebase esté listo)
  /*
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
  */

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
                      🗑️
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