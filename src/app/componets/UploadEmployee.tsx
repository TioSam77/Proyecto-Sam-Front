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

            const response = await fetch('https://api-uj4mkoe42a-uc.a.run.app/bulkEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employees: jsonData }),
            });

            const result = await response.json();
            setMessage(result.message || "Finalizado.");
        } catch (error) {
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
