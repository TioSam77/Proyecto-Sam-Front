"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import styles from '@/app/css/uploadStudents.module.css';

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
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const processedCourses = jsonData.map(course => ({
        ...course,
        code: generateCode(),
      }));

      const response = await fetch("https://api-uj4mkoe42a-uc.a.run.app/bulkCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courses: processedCourses }), // <--- aquí usamos processedCourses
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al subir los cursos");
      }

      setMessage(result.message || "Cursos subidos correctamente.");
    } catch (error: any) {
      console.error("Error:", error);
      setMessage("Error al subir los datos.");
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
