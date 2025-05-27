"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
    collection,
    doc,
    setDoc,
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { db } from "../../../firebase/clientApp";
import styles from '@/app/css/uploadStudents.module.css';

// Interfaz para los datos del Excel
interface TeacherExcelEntry {
    employee_id: string | number;
    name?: string;
    name2?: string;
    surname?: string;
    surname2?: string;
    position?: string;
    role?: string;
    email?: string;
}

const UploadEmployee = () => {
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
            const jsonData = XLSX.utils.sheet_to_json<TeacherExcelEntry>(worksheet);

            const teacherCollection = collection(db, "teacher");

            let inserted = 0;
            let authErrors = 0;
            let skipped = 0;

            for (const entry of jsonData) {
                const {
                    employee_id,
                    name = "",
                    name2 = "",
                    surname = "",
                    surname2 = "",
                    position = "",
                    role = "",
                    email = "",
                } = entry;

                if (!employee_id || !email) {
                    console.warn("Empleado con ID o email inválido:", entry);
                    skipped++;
                    continue;
                }

                let roleValue = 0;
                const roleText = role.toLowerCase();
                if (roleText === "ingles") roleValue = 3;
                else if (roleText === "administración") roleValue = 2;

                // Crear contraseña segura
                let password = (name + surname).replace(/\s/g, "").toLowerCase();
                if (password.length < 6) {
                    const fill = "123456".slice(0, 6 - password.length);
                    password += fill;
                }

                const displayName = `${surname} ${surname2} ${name} ${name2}`.trim();

                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(userCredential.user, { displayName });

                    const { uid } = userCredential.user;

                    const teacherDocRef = doc(teacherCollection, uid);
                    await setDoc(teacherDocRef, {
                        id: uid,
                        employee_id: String(employee_id),
                        name,
                        name2,
                        surname,
                        surname2,
                        position,
                        role: roleValue,
                        email,
                    });

                    inserted++;
                } catch (authError) {
                    if (authError instanceof Error) {
                        console.warn(`No se pudo registrar usuario con email ${email}:`, authError.message);
                    } else {
                        console.warn(`Error desconocido al crear usuario con email ${email}.`);
                    }
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
