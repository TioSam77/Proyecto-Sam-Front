"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
    collection,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { db } from "../../../firebase/clientApp";
import styles from '@/app/css/uploadStudents.module.css';

const UploadEmployee = () => {
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

            const teacherCollection = collection(db, "teacher");

            let inserted = 0;
            let authErrors = 0;
            let skipped = 0;

            for (const entry of jsonData) {
                const teacher = entry as any;
                const employee_id = String(teacher.employee_id);
                const name = teacher.name ?? "";
                const name2 = teacher.name2 ?? "";
                const surname = teacher.surname ?? "";
                const surname2 = teacher.surname2 ?? "";
                const position = teacher.position ?? "";
                const roleText = (teacher.role ?? "").toLowerCase();
                const email = teacher.email ?? "";

                if (!employee_id || !email) {
                    console.warn("Empleado con ID o email inválido:", teacher);
                    skipped++;
                    continue;
                }

                let role = 0;
                if (roleText === "ingles") {
                    role = 3;
                } else if (roleText === "administración") {
                    role = 2;
                }

                // Crear contraseña
                let password = (name + surname).replace(/\s/g, "").toLowerCase();
                if (password.length < 6) {
                    const fill = "123456".slice(0, 6 - password.length);
                    password += fill;
                }

                const displayName = `${surname} ${surname2} ${name} ${name2}`.trim();

                try {
                    // Crear usuario en Authentication
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(userCredential.user, { displayName });

                    const { uid } = userCredential.user;

                    // Guardar en Firestore
                    const teacherDocRef = doc(teacherCollection, uid);
                    await setDoc(teacherDocRef, {
                        id: uid,
                        employee_id,
                        name,
                        name2,
                        surname,
                        surname2,
                        position,
                        role,
                        email,
                    });

                    inserted++;
                } catch (authError: any) {
                    console.warn(`No se pudo registrar usuario con email ${email}:`, authError.message);
                    authErrors++;
                }
            }

            setMessage(
                `${inserted} empleado(s) registrado(s). ` +
                (authErrors > 0 ? ` ${authErrors} con error en Authentication. ` : "") +
                (skipped > 0 ? ` ${skipped} registros con datos inválidos.` : "")
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
            <h2 className={styles.title}> Subir archivo Excel con empleados</h2>
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

export default UploadEmployee;
