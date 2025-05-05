'use client'
import MapCourse from "@/app/componets/course/MapCourse";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../firebase/clientApp";

export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                return;
            }

            try {
                setLogin(true);

                const q = query(
                    collection(db, "course"),
                    where("teacher_id", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);

                const allData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setData(allData);
                setNotFound(allData.length === 0);
            } catch (err) {
                console.error("Error al obtener cursos:", err);
                setNotFound(true);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <MapCourse data={data} login={login} notFound={notFound} />
    );
}
