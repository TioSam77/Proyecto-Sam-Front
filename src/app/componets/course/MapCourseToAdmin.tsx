"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import styleCourse from "@/app/css/Course.module.css";
import styleUser from "@/app/css/User.module.css";
import stylesLogin from "@/app/css/Login.module.css";
import DeleteConfirm from "../DeleteConfirm";
import SelfRegister from "../student/SelfRegister";

interface MapCourseProps {
    data: course[];
    login: boolean;
    notFound: boolean;
}

interface course {
    id: string,
    name: string
    teacher_name: string
}

const MapCourseToAdmin = ({ data, login, notFound }: MapCourseProps) => {
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

    const handleDeleteClick = (user: { id: string, name: string }) => {
        setSelectedCourse(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedCourse) return;

        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/delete-course/${selectedCourse.id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Error desconocido");
            }

        } catch (err) {
            setError(`Error al eliminar: ${err}`);
        } finally {
            setShowModal(false);
            setSelectedCourse(null);
        }
    };

    return (
        <section className={styleUser.center}>
            <ol className={styleCourse.containerSubjects}>
                {login ? (
                    <li>Cargando...</li>
                ) : notFound || data.length === 0 ? (
                    <li>No cuentas con ningún curso inscrito</li>
                ) : (
                    data.map((course) => (
                        <li key={course.id} className={styleCourse.subjects}>
                            <Link href={`${basePath}/${course.id}`} className={styleCourse.header}>
                                <div className={styleCourse.image}></div>
                                <h2 className={styleCourse.textHeader}>{course.name}</h2>
                            </Link>
                            <Link href={`${basePath}/${course.id}`} className={styleCourse.body}>
                                <h5><b>Profesor:</b></h5>
                                <h5>{course.teacher_name}</h5>
                            </Link>
                            <div className={styleCourse.footer}>
                                <h5>Más detalles</h5>
                                <div className={styleCourse.containerButton}>
                                    {isAdmin ? (
                                        <>
                                            <Link href={`${basePath}/${course.id}/Editar`}>
                                                <button className="bluebutton">Editar</button>
                                            </Link>
                                            <button className="redbutton" onClick={() => handleDeleteClick(course)}><i className="bi bi-trash-fill"></i></button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`${basePath}/${course.id}/Mensajes`}>
                                                <button className='bluebutton'><i className="bi bi-chat-left-text"></i></button>
                                            </Link>
                                            <Link href={`${basePath}/${course.id}/Temario`}>
                                                <button className='bluebutton'>Temario</button>
                                            </Link>
                                        </>
                                    )}
                                </div>
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

export default MapCourseToAdmin;
