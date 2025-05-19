"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
} from "firebase/firestore";

import style from "@/app/css/navbarCourses.module.css";
import { auth, db } from "../../../../firebase/clientApp";

interface Course {
    id: string;
    name: string;
}

interface user {
    id:string
}

const NavbarCourses = () => {
    const [data, setData] = useState<Course[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [login, setLogin] = useState(false);
    const [showGroups, setShowGroups] = useState(false);
    const currentPath = usePathname();

    const isAdmin = currentPath.includes("/Administrador");
    const isStudent = currentPath.includes("/Alumno");

    const basePath = isAdmin
        ? "/Administrador/Grupos"
        : isStudent
            ? "/Alumno"
            : "/Profesor";

    const fetchCourses = async (user:user) => {
        setLogin(true);
        try {
            if (isStudent) {
                const relQuery = query(
                    collection(db, "student_course"),
                    where("student_id", "==", user.id)
                );
                const relSnap = await getDocs(relQuery);

                const courseIds = relSnap.docs.map((doc) => doc.data().course_id);

                if (courseIds.length === 0) {
                    setData([]);
                    setNotFound(true);
                    return;
                }

                const coursesPromises = courseIds.map(async (id) => {
                    const courseDoc = await getDoc(doc(db, "course", id));
                    if (courseDoc.exists()) {
                        return { id: courseDoc.id, ...courseDoc.data() } as Course;
                    }
                    return null;
                });

                const courses = (await Promise.all(coursesPromises)).filter(Boolean) as Course[];
                setData(courses);
                setNotFound(courses.length === 0);

            } else {
                const q = query(
                    collection(db, "course"),
                    where("teacher_id", "==", user.id)
                );
                const querySnapshot = await getDocs(q);

                const allData: Course[] = querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        name: docData.name,
                    };
                });

                setData(allData);
                setNotFound(allData.length === 0);
            }
        } catch (err) {
            console.error("Error al obtener cursos:", err);
            setNotFound(true);
        } finally {
            setLogin(false);
        }
    };

    const handleToggleGroups = () => {
        setShowGroups((prev) => {
            const next = !prev;
            if (next && data.length === 0) {
                onAuthStateChanged(auth, (user) => {
                    if (user) fetchCourses({ id: user.uid });
                });
            }
            return next;
        });
    };

    return (
        <div className={style.navbarCourseContainer}>
            <button className=" nav-link" onClick={handleToggleGroups}>
                Grupos
            </button>

            {showGroups && (
                login ? (
                    <p className={style.emptyText}>Cargando cursos...</p>
                ) : notFound || data.length === 0 ? (
                    <p className={style.emptyText}>No hay cursos</p>
                ) : (
                    data.map((course) => (
                        <Link key={course.id} href={`${basePath}/${course.id}`} className={style.courseCard}>
                            <div className={style.cardBody}>
                                <div className={style.courseCircle}>
                                    {course.name.charAt(0).toUpperCase()}
                                </div>
                                <p className={style.courseName}>{course.name}</p>
                            </div>
                        </Link>
                    ))
                )
            )}
        </div>
    );
};

export default NavbarCourses;
