"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import styleCourse from "@/app/css/Course.module.css";
import styleUser from "@/app/css/User.module.css";
import stylesLogin from "@/app/css/Login.module.css";
import DeleteConfirm from "../DeleteConfirm";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from '@/../firebase/clientApp';
import SelfRegister from "../student/SelfRegister";

interface MapCourseProps {
    data: course[];
    login: boolean;
    notFound: boolean;
}

interface course {
    id: string,
    name: string
}

const MapCourse = ({ data, login, notFound }: MapCourseProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string } | null>(null);
    const [showSelfRegister, setShowSelfRegister] = useState(false);

    const [error, setError] = useState<string | null>("");

    const pathname = usePathname();
    const segments = pathname.split('/');
    const isAdmin = segments[1] === "Administrador";
    const isStudent = segments[1] === "Alumno";
    const basePath = isAdmin
        ? '/Administrador/Grupos'
        : isStudent
            ? '/Alumno'
            : '/Profesor';

    const filteredCourses = data.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: { id: string, name: string }) => {
        setSelectedCourse(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedCourse) return;
        try {
            // 1. Eliminar el curso principal
            await deleteDoc(doc(db, "course", selectedCourse.id));

            // 2. Eliminar registros relacionados en student_course
            const studentCoursesSnapshot = await getDocs(
                query(collection(db, "student_course"), where("course_id", "==", selectedCourse.id))
            );
            const deleteStudentCourses = studentCoursesSnapshot.docs.map(docu =>
                deleteDoc(doc(db, "student_course", docu.id))
            );
            await Promise.all(deleteStudentCourses);

            // 3. Eliminar registros relacionados en course_schedule
            const scheduleSnapshot = await getDocs(
                query(collection(db, "course_schedule"), where("course_id", "==", selectedCourse.id))
            );
            const deleteSchedules = scheduleSnapshot.docs.map(docu =>
                deleteDoc(doc(db, "course_schedule", docu.id))
            );
            await Promise.all(deleteSchedules);

            // 4. Eliminar registros relacionados en course_messages
            const messagesRef = collection(db, 'course_messages', selectedCourse.id, 'messages');
            const messagesSnapshot = await getDocs(messagesRef);

            for (const msgDoc of messagesSnapshot.docs) {
                // Borramos todas las respuestas del mensaje
                const responsesRef = collection(db, 'course_messages', selectedCourse.id, 'messages', msgDoc.id, 'responses');
                const responsesSnapshot = await getDocs(responsesRef);

                const deleteResponsesPromises = responsesSnapshot.docs.map(resDoc =>
                    deleteDoc(doc(db, 'course_messages', selectedCourse.id, 'messages', msgDoc.id, 'responses', resDoc.id))
                );
                await Promise.all(deleteResponsesPromises);

                // Borramos el mensaje
                await deleteDoc(doc(db, 'course_messages', selectedCourse.id, 'messages', msgDoc.id));
            }

            // Finalmente borramos el documento principal del curso en course_messages
            await deleteDoc(doc(db, 'course_messages', selectedCourse.id));

        } catch (err) {
            setError(`Error al eliminar: ${err}`);
        } finally {
            setShowModal(false);
            setSelectedCourse(null);
        }
    };


    return (
        <section className={styleUser.center}>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: "10px",
                }}
            >
                <input
                    type="text"
                    placeholder="Buscar curso..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton">Buscar</button>
                {isStudent && (
                    <button
                        className={styleUser.button}
                        onClick={() => setShowSelfRegister(true)}
                    >
                        +
                    </button>
                )}

                {isAdmin &&
                    <Link href={`/Administrador/Grupos/Registro`}>
                        <button className={styleUser.button}>Nuevo Grupo</button>
                    </Link>
                }
            </div>
            <ol className={styleCourse.containerSubjects}>
                {login ? (
                    <li>Cargando...</li>
                ) : notFound || filteredCourses.length === 0 ? (
                    <li>No cuentas con ningún curso inscrito</li>
                ) : (
                    filteredCourses.map((course) => (
                        <li key={course.id} className={styleCourse.subjects}>
                            <Link href={`${basePath}/${course.id}`} className={styleCourse.header}>
                                <div className={styleCourse.image}></div>
                                <h2 className={styleCourse.textHeader}>{course.name}</h2>
                            </Link>
                            <Link href={`${basePath}/${course.id}`} className={styleCourse.body}>
                                <h5>Información sobre {course.name}</h5>
                            </Link>
                            <div className={styleCourse.footer}>
                                <h5>Más detalles</h5>
                                {isAdmin && (
                                    <div className={styleCourse.containerButton}>
                                        <Link href={`${basePath}/${course.id}/Editar`}>
                                            <button className="bluebutton">Editar</button>
                                        </Link>
                                        <button className="redbutton" onClick={() => handleDeleteClick(course)}><i className="bi bi-trash-fill"></i></button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ol>

            {showModal && selectedCourse && (
                <DeleteConfirm
                    name={selectedCourse.name}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedCourse(null);
                    }}
                />
            )}

            {showSelfRegister &&
                <SelfRegister onClose={() => setShowSelfRegister(false)} />
            }

            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
            </div>
        </section >
    );
};

export default MapCourse;
