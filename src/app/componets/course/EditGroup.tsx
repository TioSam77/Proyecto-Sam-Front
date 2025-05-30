'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/app/css/EditGroup.module.css';
import { useParams } from 'next/navigation';

type GroupData = {
  name: string;
  type: string;
  subject_id: string;
  subject_name: string;
  teacher_name2: string;
  teacher_surname: string;
  teacher_surname2: string;
  teacher_name: string;
  teacher_id: string;
  start_date: string;
  end_date: string;
  active: boolean;
};

type Teacher = {
  id: string;
  name: string;
  name2: string;
  surname: string;
  surname2: string;
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
    type: '',
    subject_id: '',
    subject_name: '',
    teacher_name2: '',
    teacher_surname: '',
    teacher_surname2: '',
    teacher_name: '',
    teacher_id: '',
    start_date: '',
    end_date: '',
    active: true,
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
    setError(null);

    const fetchGroupData = fetch(`https://api-uj4mkoe42a-uc.a.run.app/course/${courseId}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener grupo");
        return res.json();
      });

    const fetchTeachersSubjects = fetch("https://api-uj4mkoe42a-uc.a.run.app/teachers-subjects")
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener profesores o materias");
        return res.json();
      });

    Promise.all([fetchGroupData, fetchTeachersSubjects])
      .then(([groupData, { teachers, subjects }]) => {
        setGroupData(groupData);
        setTeachers(teachers);
        setSubjects(subjects);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSave = async () => {
    if (!editingField) return;

    try {
      setLoading(true);

      const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/put-course/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: editingField,
          value: tempValue,
          teachers,
          subjects,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al actualizar grupo");
      }

      const { updates } = await res.json();
      setGroupData((prev) => ({ ...prev, ...updates }));
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
    type: 'text' | 'date' | 'select' | 'checkbox' = 'text'
  ) => {
    if (editingField === field) {
      if (field === 'teacher_name') {
        // Select profesor
        return (
          <div className={styles.infoRow}>
            <span className={styles.label}>{label}</span>
            <div className={styles.value}>
              <select
                className={styles.input}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              >
                <option value="">Selecciona un profesor</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.surname} {t.surname2} {t.name} {t.name2}
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
          </div>
        );
      }

      if (field === 'subject_name') {
        // Select materia
        return (
          <div className={styles.infoRow}>
            <span className={styles.label}>{label}</span>
            <div className={styles.value}>
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
          </div>
        );
      }

      if (field === 'active') {
        return (
          <div className={styles.infoRow}>
            <span className={styles.label}>{label}</span>
            <div className={styles.value}>
              <select
                className={styles.input}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              >
                <option value="true">true</option>
                <option value="false">false</option>
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
          </div>
        );
      }

      // input text o date para los demás campos
      return (
        <div className={styles.infoRow}>
          <span className={styles.label}>{label}</span>
          <div className={styles.value}>
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
        </div>
      );
    }

    // Mostrar valor (para teacher_id mostramos teacher_name)
    let displayValue = groupData[field];
    if (field === 'active') displayValue = groupData.active ? 'Activo' : 'Inactivo';

    return (
      <div className={styles.infoRow}>
        <span className={styles.label}>{label}</span>
        <div className={styles.value}>
          <span className={styles.value}>{displayValue}</span>
          <button
            className={styles.editButton}
            onClick={() => {
              setEditingField(field);
              setTempValue(field === 'active' ? groupData[field].toString() : groupData[field]);
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.groupCard}>
      <h2 className={styles.title}>Editar Grupo</h2>
      {renderField('Nombre:', 'name')}
      {renderField('Tipo:', 'type')}
      {renderField('Materia:', 'subject_name', 'select')}
      {renderField('Profesor:', 'teacher_name', 'select')}
      {renderField('Fecha inicio:', 'start_date', 'date')}
      {renderField('Fecha fin:', 'end_date', 'date')}
      {renderField('Activo:', 'active', 'checkbox')}
    </div>
  );
};

export default EditGroup;
