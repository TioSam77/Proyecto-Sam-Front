"use client";
import { useEffect, useState } from "react";
import tables from "@/app/css/Table.module.css";
import stylesLogin from "@/app/css/Login.module.css";

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, limit, where, setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from '@/../firebase/clientApp';
import { useParams } from "next/navigation";

interface Student {
    id: string;
    name: string;
    name2: string;
    surname: string;
    surname2: string;
    active: boolean;
}

const TableAddStudent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const params = useParams();
    const courseId = params?.id as string;

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = () => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLoading(false);
                setError('Estudiante no encontrado')
                return;
            }

            try {
                const q = searchTerm
                    ? query(
                        collection(db, "student"),
                        where("name", ">=", searchTerm),
                        where("name", "<=", searchTerm + "\uf8ff")
                    )
                    : query(collection(db, "student"), limit(10));

                const querySnapshot = await getDocs(q);
                const students = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Student[];

                // Verificar si cada estudiante está registrado en el curso
                const studentsWithStatus = await Promise.all(
                    students.map(async (student) => {
                        const relQuery = query(
                            collection(db, "student_course"),
                            where("student_id", "==", student.id),
                            where("course_id", "==", courseId)
                        );

                        const relSnapshot = await getDocs(relQuery);
                        const isRegistered = !relSnapshot.empty;

                        return {
                            ...student,
                            active: isRegistered, // Esto activa el toggle visual
                        };
                    })
                );

                setData(studentsWithStatus);
                setNotFound(studentsWithStatus.length === 0);
            } catch (err) {
                setError(`Error al obtener estudiantes: ${err}`);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    };

    const handleRegister = async (student: Student) => {
        try {
            // Verificar si el curso existe
            const courseRef = doc(db, "course", courseId);
            const courseSnap = await getDoc(courseRef);
            if (!courseSnap.exists()) {
                setError("El curso no existe.");
                return;
            }

            // Verificar si el estudiante existe
            const studentRef = doc(db, "student", student.id);
            const studentSnap = await getDoc(studentRef);
            if (!studentSnap.exists()) {
                setError("El estudiante no existe.");
                return;
            }

            // Registrar la relación
            const customId = `${student.id}_${courseId}`;
            await setDoc(doc(db, "student_course", customId), {
                name: student.name,
                name2: student.name2,
                surname: student.surname,
                surname2: student.surname2,
                student_id: student.id,
                course_id: courseId,
            });

            setAlert(`Estudiante ${student.name} registrado correctamente.`);
            handleSearch();
        } catch (error) {
            setError(`Error al registrar estudiante: ${error}`);
        }
    };

    return (
        <section className={tables.TableContainer}>
            <h4>Agregar estudiante al curso</h4>
            <div className={tables.selectAndButton}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton" onClick={handleSearch}>
                    Buscar
                </button>
            </div>
            <div className={tables.box}>
                <table>
                    <thead>
                        <tr className={tables.fixedRow}>
                            <th>Apellido</th>
                            <th className={tables.fixedColRow}>Nombre</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3}>Cargando...</td>
                            </tr>
                        ) : notFound ? (
                            <tr>
                                <td colSpan={3}>Estudiante no encontrado</td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}
                                >
                                    <td>
                                        {row.surname} {row.surname2}
                                    </td>
                                    <td className={`${tables.fixedCol} ${index % 2 === 0 ? tables["row-even"] : tables["row-odd"]}`}>
                                        {row.name}
                                    </td>
                                    <td>
                                        {row.active ? (
                                            <span style={{ fontWeight: "bold", color: "green" }}>Inscrito</span>
                                        ) : (
                                            <button
                                                onClick={() => handleRegister(row)}
                                                className="toggle-button"
                                            >
                                                Inscribir
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
                {alert && <div className={stylesLogin.alertBox}>{alert}</div>}
                {loading && <div className={stylesLogin.loading}>loading</div>}
            </div>
        </section>
    );
};

export default TableAddStudent;
