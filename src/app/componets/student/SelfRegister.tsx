"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase/clientApp";
import styles from '@/app/css/selfRegister.module.css';
import stylesLogin from "@/app/css/Login.module.css";

interface student {
    id: string;
    name?: string;
}

export default function SelfRegister({ onClose }: { onClose: () => void }) {
    const [code, setCode] = useState("");
    const [student, setStudent] = useState<student>();

    const [error, setError] = useState<string | null>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchStudent() {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser?.email) {
                setError("No hay usuario autenticado.");
                setLoading(false);
                return;
            }

            const studentData = await getStudentByEmail(currentUser.email);
            if (!studentData) {
                setError("No se encontró el usuario en la base de datos.");
            } else {
                setStudent(studentData);
            }
            setLoading(false);
        }

        fetchStudent();
    }, []);

    async function getStudentByEmail(email: string) {
        const studentRef = collection(db, "student");
        const q = query(studentRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }
        return null;
    }

    const handleRegister = async () => {
        if (!code) {
            setError("Ingresa un código de grupo.");
            return;
        }

        if (!student) {
            setError("No se pudo obtener la información del estudiante.");
            return;
        }

        try {
            const res = await fetch("https://api-uj4mkoe42a-uc.a.run.app/post-selfRegister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, student }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Error desconocido");
            }

            setAlert(`Estudiante ${student.name} registrado correctamente en el grupo.`);
            onClose();
        } catch (err) {

            setError( `Error al registrar el estudiante.${err}`);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <button
                    className={styles.modalCloseButton}
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    &times;
                </button>
                <h2 className={styles.modalTitle}>Código de la clase</h2>
                <p>Pidele a tu profesor el codigo de la clase y luego,ingresalo aqui</p>
                {error && <p className={styles.modalError}>{error}</p>}
                <input
                    type="text"
                    placeholder="Código de la clase"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={styles.modalInput}
                />
                <button onClick={handleRegister} className={styles.modalButton}>
                    Unirme
                </button>
            </div>

            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
                {alert && <div className={stylesLogin.alertBox}>{alert}</div>}
                {loading && <div className={stylesLogin.loading}>loading</div>}
            </div>
        </div>
    );
}
