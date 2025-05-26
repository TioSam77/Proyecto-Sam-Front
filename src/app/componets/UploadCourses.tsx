"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import styles from '@/app/css/uploadStudents.module.css'; // Puedes cambiar el nombre del CSS si prefieres

const UploadCourses = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const courseCollection = collection(db, "course");

      let inserted = 0;
      let duplicates = 0;

      for (const entry of jsonData) {
        const course = entry as { id: string | number; name?: string };
        const id = String(course.id);
        const name = course.name ?? "";

        if (!id) {
          console.warn("Curso sin ID válido:", course);
          continue;
        }

        const courseDocRef = doc(courseCollection, id);
        const existingCourseDoc = await getDoc(courseDocRef);

        if (existingCourseDoc.exists()) {
          duplicates++;
          continue;
        }

        // Guardar curso
        await setDoc(courseDocRef, {
          ...course,
          id,
          name,
        });

        inserted++;
      }

      setMessage(
        `${inserted} curso(s) registrados.` +
        (duplicates > 0 ? ` ${duplicates} duplicado(s).` : "")
      );
    } catch (error) {
      console.error("Error leyendo o subiendo cursos:", error);
      setMessage(" Error al subir los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Subir archivo Excel con cursos</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className={styles.fileInput}
      />

      {loading && <p className={styles.loading}>Cargando...</p>}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default UploadCourses;
