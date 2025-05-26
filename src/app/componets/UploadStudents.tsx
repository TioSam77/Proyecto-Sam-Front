"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../../firebase/clientApp";
import styles from '@/app/css/uploadStudents.module.css';

const UploadStudents = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    const auth = getAuth();

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const studentCollection = collection(db, "student");
      const studentCourseCollection = collection(db, "student_course");
      const courseCollection = collection(db, "course");

      let inserted = 0;
      let duplicates = 0;
      let noCourse = 0;
      let authErrors = 0;

      for (const entry of jsonData) {
        const student = entry as any;
        const id = String(student.id);
        const name = student.name ?? "";
        const surname = student.surname ?? "";
        const surname2 = student.surname2 ?? "";
        const name2 = student.name2 ?? "";
        const email = student.email ?? "";
        const courseId = student.course_id ?? "";

        if (!id || !email) {
          console.warn("Estudiante con ID o email inválido:", student);
          continue;
        }

        const studentDocRef = doc(studentCollection);
        const existingStudent = await getDoc(studentDocRef);

        if (existingStudent.exists()) {
          duplicates++;
          continue;
        }

        // Crear contraseña
        let password = (name + surname).replace(/\s/g, "").toLowerCase();
        if (password.length < 6) {
          const fill = "123456".slice(0, 6 - password.length);
          password += fill;
        }

        const displayName = `${surname} ${surname2} ${name} ${name2}`.trim();

        // Crear usuario en Authentication
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName });
        } catch (authError: any) {
          console.warn(`No se pudo registrar usuario con email ${email}:`, authError.message);
          authErrors++;
          continue; // ⚠️ Saltar todo el registro si el auth falla
        }

        // Registrar en colección "student"
        await setDoc(studentDocRef, {
          ...student,
          id,
        });

        inserted++;

        // Asociar con curso si existe
        if (courseId) {
          // Buscar documento donde el campo course_id sea igual al del Excel
          const q = query(courseCollection, where("course_id", "==", courseId));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Obtener el ID del primer documento que coincida
            const courseDoc = querySnapshot.docs[0];
            const courseDocId = courseDoc.id;

            await addDoc(studentCourseCollection, {
              student_id: id,
              name,
              course_id: courseDocId,
            });
          } else {
            noCourse++;
          }
        } else {
          noCourse++;
        }
      }

      setMessage(
        `${inserted} registrado(s). ` +
        (duplicates > 0 ? ` ${duplicates} duplicado(s) en Firestore. ` : "") +
        (noCourse > 0 ? ` ${noCourse} sin curso asignado. ` : "") +
        (authErrors > 0 ? ` ${authErrors} no registrados por email repetido.` : "")
      );
    } catch (error) {
      console.error("Error leyendo o subiendo datos:", error);
      setMessage(" Error al subir los datos.");
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
