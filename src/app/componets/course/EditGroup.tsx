'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/app/css/EditGroup.module.css';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../../firebase/clientApp';

type GroupData = {
  name: string;
  subject_name: string; // aquí guardamos el id del subject seleccionado
  teacher_name: string; // para mostrar nombre del profesor
  teacher_id: string;   // id del profesor seleccionado
  start_date: string;
  end_date: string;
};

type Teacher = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
};

const EditGroup = () => {
  const params = useParams();
  const courseId = params?.id as string;

  const [groupData, setGroupData] = useState<GroupData>({
    name: '',
    subject_name: '',
    teacher_name: '',
    teacher_id: '',
    start_date: '',
    end_date: '',
  });
  const [editingField, setEditingField] = useState<null | keyof GroupData>(null);
  const [tempValue, setTempValue] = useState('');

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del grupo + listas de teachers y subjects
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setGroupData({
          name: '',
          subject_name: '',
          teacher_name: '',
          teacher_id: '',
          start_date: '',
          end_date: '',
        });
        return;
      }

      try {
        // Obtener grupo
        const docRef = doc(db, 'course', courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setGroupData({
            name: data.name || '',
            subject_name: data.subject_name || '',
            teacher_name: data.teacher_name || '',
            teacher_id: data.teacher_id || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
          });
        } else {
          setError('No se encontró el grupo.');
        }

        // Obtener profesores
        const queryTeachers = await getDocs(collection(db, 'teacher'));
        const allTeachers = queryTeachers.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as { name: string }),
        }));
        setTeachers(allTeachers);

        // Obtener materias
        const querySubjects = await getDocs(collection(db, 'subject'));
        const allSubjects = querySubjects.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as { name: string }),
        }));
        setSubjects(allSubjects);

      } catch (err) {
        setError(`Error al obtener datos: ${err}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [courseId]);

  // Guardar cambios
  const handleSave = async () => {
    if (!editingField) return;

    let updatedData: Partial<GroupData> = {};

    if (editingField === 'teacher_id') {
      const selectedTeacher = teachers.find(t => t.id === tempValue);
      if (selectedTeacher) {
        updatedData.teacher_name = selectedTeacher.name;
        updatedData.teacher_id = selectedTeacher.name;
      }
    } else if (editingField === 'subject_name') {
      const selectedSubject = subjects.find(s => s.id === tempValue);
      if (selectedSubject) {
        updatedData.subject_name = selectedSubject.name;
      }
    } else {
      updatedData[editingField] = tempValue;
    }

    try {
      setLoading(true);
      const docRef = doc(db, 'course', courseId);
      await updateDoc(docRef, updatedData);

      // Si cambió el nombre, actualizar course_schedule.name
      if (editingField === 'name') {
        const scheduleQuery = query(
          collection(db, "course_schedule"),
          where("course_id", "==", courseId)
        );
        const querySnapshot = await getDocs(scheduleQuery);

        // Para cada schedule que tenga ese course_id, actualizar el campo name
        const promises = querySnapshot.docs.map(docSchedule =>
          updateDoc(doc(db, "course_schedule", docSchedule.id), { name: tempValue })
        );
        await Promise.all(promises);
      }

      setGroupData(prev => ({ ...prev, ...updatedData }));
      setEditingField(null);
      setTempValue('');
    } catch (err) {
      setError(`Error al guardar cambios: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  // Renderizado de campo
  const renderField = (
    label: string,
    field: keyof GroupData,
    type: 'text' | 'date' | 'select' = 'text'
  ) => {
    if (editingField === field) {
      if (field === 'teacher_id') {
        // Select profesor
        return (
          <div className={styles.infoRow}>
            <span className={styles.label}>{label}</span>
            <select
              className={styles.input}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            >
              <option value="">Selecciona un profesor</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className={styles.actions}>
              <button className={styles.saveButton} onClick={handleSave}>
                Guardar
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        );
      }

      if (field === 'subject_name') {
        // Select materia
        return (
          <div className={styles.infoRow}>
            <span className={styles.label}>{label}</span>
            <select
              className={styles.input}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            >
              <option value="">Selecciona una materia</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className={styles.actions}>
              <button className={styles.saveButton} onClick={handleSave}>
                Guardar
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        );
      }

      // input text o date para los demás campos
      return (
        <div className={styles.infoRow}>
          <span className={styles.label}>{label}</span>
          <input
            className={styles.input}
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleSave}>
              Guardar
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    // Mostrar valor (para teacher_id mostramos teacher_name)
    let displayValue = groupData[field];
    if (field === 'teacher_id') displayValue = groupData.teacher_name;

    return (
      <div className={styles.infoRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{displayValue}</span>
        <button
          className={styles.editButton}
          onClick={() => {
            setEditingField(field);
            setTempValue(groupData[field]);
          }}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
      </div>
    );
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.groupCard}>
      <h2 className={styles.title}>Editar Grupo</h2>
      {renderField('Nombre:', 'name')}
      {renderField('Materia:', 'subject_name', 'select')}
      {renderField('Profesor:', 'teacher_id', 'select')}
      {renderField('Fecha inicio:', 'start_date', 'date')}
      {renderField('Fecha fin:', 'end_date', 'date')}
    </div>
  );
};

export default EditGroup;
