'use client';
import MapCourse from "@/app/componets/course/MapCourse";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from '@/../firebase/clientApp';

interface data {
    id: string
    name: string
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
                const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-studentCourse/${user.uid}`);
                if (!res.ok) throw new Error("Error al obtener los cursos");

                const courses = await res.json();
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
