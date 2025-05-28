"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import styles from '@/app/css/uploadStudents.module.css';

const UploadStudents = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    setLoading(true);
    setMessage("");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const res = await fetch("http://localhost:4000/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: jsonData }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(result.message);
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error leyendo archivo:", error);
      setMessage("Error procesando archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}> Subir archivo Excel con estudiantes</h2>
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

export default UploadStudents;
