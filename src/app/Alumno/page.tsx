'use client';
import MapCourse from "@/app/componets/course/MapCourse";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from '@/../firebase/clientApp';

interface data{
    id:string
    name:string
    teacher_name: string
}

export default function Page() {
    const [data, setData] = useState<data[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            setLogin(true);
            try {
                // Paso 1: obtener las relaciones student_course del alumno actual
                const relQuery = query(
                    collection(db, "student_course"),
                    where("student_id", "==", user.uid)
                );
                const relSnap = await getDocs(relQuery);

                const courseIds = relSnap.docs.map((doc) => doc.data().course_id);

                if (courseIds.length === 0) {
                    setData([]);
                    setNotFound(true);
                    return;
                }

                // Paso 2: obtener los cursos con esos IDs
                const coursesPromises = courseIds.map(async (id) => {
                    const courseDoc = await getDoc(doc(db, "course", id));
                    if (courseDoc.exists()) {
                        return { id: courseDoc.id, ...courseDoc.data() };
                    }
                    return null;
                });

                const courses = (await Promise.all(coursesPromises)).filter(Boolean) as data[];

                setData(courses);
                setNotFound(courses.length === 0);
            } catch (err) {
                console.error("Error al obtener cursos inscritos:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return <MapCourse data={data} login={login} notFound={notFound} />;
}
