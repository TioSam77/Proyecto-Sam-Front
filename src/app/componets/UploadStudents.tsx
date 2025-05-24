"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

const UploadStudents = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      // Leer el archivo como array buffer
      const data = await file.arrayBuffer();

      // Parsear el excel
      const workbook = XLSX.read(data);

      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir a JSON (array de objetos)
      // La primera fila será la clave del objeto
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // jsonData es un array de objetos donde cada objeto es un estudiante con sus campos

      // Insertar cada estudiante a Firestore
      const studentCollection = collection(db, "student");

      for (const student of jsonData) {
        // Aquí puedes modificar o validar el objeto 'student' si quieres
        await addDoc(studentCollection, student);
      }

      setMessage(`Se registraron ${jsonData.length} estudiantes correctamente.`);
    } catch (error) {
      console.error("Error leyendo o subiendo datos:", error);
      setMessage("Error al subir los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subir archivo Excel con estudiantes</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />

      {loading && <p>Cargando...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadStudents;
