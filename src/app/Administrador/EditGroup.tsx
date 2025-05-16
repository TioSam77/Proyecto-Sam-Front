'use client';
import React, { useState } from 'react';
import styles from '@/app/css/EditGroup.module.css';

const initialData = {
  groupName: 'Kricosos 3',
  subjectName: 'mate',
  teacherName: 'wazowski mike',
};

const EditGroup = () => {
  const [groupData, setGroupData] = useState(initialData);
  const [editingField, setEditingField] = useState<null | string>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(groupData[field as keyof typeof groupData]);
  };

  const handleSave = () => {
    setGroupData(prev => ({ ...prev, [editingField as string]: tempValue }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const renderField = (label: string, field: string) => (
    <div className={styles.infoRow}>
      <span className={styles.label}>{label}</span>
      {editingField === field ? (
        <>
          <input
            className={styles.input}
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <span className={styles.value}>{groupData[field as keyof typeof groupData]}</span>
          <button className={styles.editButton} onClick={() => handleEdit(field)}>✏️</button>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.groupCard}>
      <h2 className={styles.title}>Editar Grupo</h2>
      {renderField('Grupo:', 'groupName')}
      {renderField('Materia:', 'subjectName')}
      {renderField('Profesor:', 'teacherName')}
    </div>
  );
};

export default EditGroup;
