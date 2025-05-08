'use client'
import styleCourse from "@/app/css/Course.module.css";
import styles from '@/app/css/infoCourse.module.css';
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

const ViewGroup = () => {
    const [courseData, setCourseData] = useState<any>(null);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    const pathname = usePathname();
    const isAdmin = pathname.includes("/Administrador")
    const isTeacher = pathname.includes("/Profesor")
    const segments = pathname.split('/');
    let courseId: string = ""
    isAdmin ? courseId = segments[3] : courseId = segments[2]

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setCourseData(null);
                return;
            }

            try {
                setLogin(true);
                const docRef = doc(db, "course", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCourseData({ id: docSnap.id, ...docSnap.data() });
                    setNotFound(false);
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Error al obtener el curso:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
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
                    <p className={styles.welcome}>Bienvenido:</p>

                    :
                    <p className={styles.welcome}>Profesor:</p>
                }
                <div className={styles.flexrow}>
                    <p className={styles.teacher}>{courseData?.teacher_name || ""}</p>
                    <div></div>
                    {(!isAdmin) ?
                        <button className='bluebutton'>Abrir temario</button>
                        :
                        <button className='bluebutton'>Agregar Temario</button>}
                </div>
            </div>
        </>
    );
};

export default ViewGroup;
