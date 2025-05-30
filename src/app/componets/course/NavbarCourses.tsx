"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import style from "@/app/css/navbarCourses.module.css";
import { auth } from '@/../firebase/clientApp';

interface Course {
    id: string;
    name: string;
}

interface user {
    id: string
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

    const fetchCourses = async (user: user) => {
        setLogin(true);
        try {
            let response;
            if (isStudent) {
                response = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-studentCourse/${user.id}`);
            } else {
                response = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-teacherCourse/${user.id}`);
            }

            if (!response.ok) throw new Error("Error al obtener los cursos");

            const courses = await response.json();
            setData(courses);
            setNotFound(courses.length === 0);
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
            <button className="nav-link d-flex align-items-center gap-2" onClick={handleToggleGroups}>
                <i className="bi bi-people-fill text-dark"></i>
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
