'use client'
import styleCourse from "@/app/css/Course.module.css";
import styles from '@/app/css/infoCourse.module.css';
import { onAuthStateChanged } from "firebase/auth";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from '@/../firebase/clientApp';

import stylesLogin from "@/app/css/Login.module.css";
import Link from "next/link";

interface courseData {
    id: string,
    name?: string,
    subject_name?: string,
    teacher_name?: string,
    code?: string
}

const ViewGroup = () => {
    const [courseData, setCourseData] = useState<courseData | null>(null);

    const [error, setError] = useState<string | null>("");
    const [loading, setLoading] = useState<boolean>(false);

    const pathname = usePathname();
    const isAdmin = pathname.includes("/Administrador")
    const isTeacher = pathname.includes("/Profesor")
    const segments = pathname.split('/');
    const params = useParams();
    const courseId = params?.id as string;
    const user: string = segments[1]

    useEffect(() => {
        const fetchCourse = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    setCourseData(null);
                    return;
                }

                try {
                    setLoading(true);
                    const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/course/${courseId}`);
                    if (!res.ok) {
                        throw new Error("Curso no encontrado");
                    }

                    const data = await res.json();
                    setCourseData(data);
                } catch (err) {
                    setError(`Error al obtener el curso: ${err}`);
                } finally {
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        };

        fetchCourse();
    }, [courseId]);


    return (
        <>
            <section className={styleCourse.viewHeader}>
                <div className={styleCourse.header}>
                    <div className={styleCourse.image}></div>
                    <h1 className={styleCourse.textHeader}>{courseData?.name || ""}</h1>
                    <h4 className={styleCourse.textSubject}>{courseData?.subject_name || ""}</h4>
                </div>
            </section>
            <div className={styles.card}>
                {isTeacher ?
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p className={styles.welcome}>Bienvenido:</p>
                        <p>Codigo : {courseData?.code}</p>
                    </div>
                    :
                    <p className={styles.welcome}>Profesor:</p>
                }
                <p className={styles.teacher}>{courseData?.teacher_name}</p>
                <div className={styles.flexrow}>

                    <div></div>
                    {(!isAdmin) ?
                        <div className={stylesLogin.gap}>
                            <Link href={`/${user}/${courseId}/Mensajes`}>
                                <button className='bluebutton'><i className="bi bi-chat-left-text"></i></button>
                            </Link>
                            <Link href={`/${user}/${courseId}/`}>
                                <button className='bluebutton'>Bitacora</button>
                            </Link>
                            <Link href={`/${user}/${courseId}/Temario`}>
                                <button className='bluebutton'>Temario</button>
                            </Link>
                        </div>
                        :
                        <div className={stylesLogin.gap}>
                            <Link href={`/Administrador/Grupos/${courseId}/Mensajes`}>
                                <button className='bluebutton'><i className="bi bi-chat-left-text"></i></button>
                            </Link>
                            <Link href={`/Administrador/Grupos/${courseId}/`}>
                                <button className='bluebutton'>Bitacora</button>
                            </Link>
                            <Link href={`/Administrador/Grupos/${courseId}/Temario`}>
                                <button className='bluebutton'>Agregar Temario</button>
                            </Link>
                        </div>
                    }
                </div>
            </div>

            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
                {loading && <div className={stylesLogin.loading}>loading</div>}
            </div>
        </>
    );
};

export default ViewGroup;
