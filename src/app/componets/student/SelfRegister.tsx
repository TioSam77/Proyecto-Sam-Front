"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "@/../firebase/clientApp";

export default function SelfRegister({ onClose }: { onClose: () => void }) {
    const [code, setCode] = useState("");
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            // Verificar si el curso existe
            const courseRef = collection(db, "course");
            const courseQuery = query(courseRef, where("code", "==", code));
            const courseSnap = await getDocs(courseQuery);

            if (courseSnap.empty) {
                setError("El curso no existe.");
                return;
            }

            const courseDoc = courseSnap.docs[0];
            const courseId = courseDoc.id;

            // Registrar relación student_course
            const customId = `${student.id}_${courseId}`;
            await setDoc(doc(db, "student_course", customId), {
                name: `${student.name} `,
                student_id: student.id,
                course_id: courseId,
            });

            alert(`Estudiante ${student.name} registrado correctamente en el grupo.`);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Error al registrar el estudiante.");
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md text-center shadow-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Unirse a un grupo</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Código del grupo"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                />
                <button onClick={handleRegister} className="bluebutton w-full">
                    Unirme
                </button>
            </div>
        </div>
    );
}
