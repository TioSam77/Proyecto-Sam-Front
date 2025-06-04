'use client';
import MapCourse from "@/app/componets/course/MapCourse";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from '@/../firebase/clientApp';
import { envCredentials } from "../../../firebase/envConfigurations";

interface data {
    id: string
    name: string
    teacher_name: string
}

export default function Page() {
    const [data, setData] = useState<data[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);
    const { api } = envCredentials();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            setLogin(true);

            try {
                const res = await fetch(`${api}/get-studentCourse/${user.uid}`);
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

    return <MapCourse data={data} login={login} notFound={notFound} show={false} />;
}
