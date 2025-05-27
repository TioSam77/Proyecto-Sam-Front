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

interface StudentExcelEntry {
  student_id: string | number;
  name?: string;
  name2?: string;
  surname?: string;
  surname2?: string;
  email: string;
  course_id?: string;
  [key: string]: unknown;
}


const UploadStudents = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

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
      const authErrors = 0;

      for (const entry of jsonData) {
        const student = entry as StudentExcelEntry;
        const student_id = String(student.student_id);
        const name = student.name ?? "";
        const surname = student.surname ?? "";
        const surname2 = student.surname2 ?? "";
        const name2 = student.name2 ?? "";
        const email = student.email ?? "";
        const courseId = student.course_id ?? "";

        if (!student_id || !email) {
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

          const { uid } = userCredential.user;

          // Guardar en Firestore: ID del documento = uid
          const studentDocRef = doc(studentCollection, uid);
          await setDoc(studentDocRef, {
            ...student,
            id: uid,
          });

          inserted++;

          // Asociar con curso
          if (courseId) {
            const q = query(courseCollection, where("course_id", "==", courseId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const courseDoc = querySnapshot.docs[0];

              await addDoc(studentCourseCollection, {
                student_id: uid,
                name,
                name2,
                surname,
                surname2,
                course_id: courseDoc.id, // Usamos el ID real del documento
              });
            } else {
              noCourse++;
            }
          } else {
            noCourse++;
          }

        } catch (authError: unknown) {
          if (
            authError &&
            typeof authError === "object" &&
            "message" in authError
          ) {
            console.warn(`No se pudo registrar usuario con email ${email}:`, (authError as { message: string }).message);
          } else {
            console.warn(`No se pudo registrar usuario con email ${email}:`, authError);
          }

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
