"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import style from "@/app/css/navbarCourses.module.css"; // Crea este archivo para estilos específicos del navbar

interface NavbarCourseProps {
    data: course[];
}

interface course {
    id: string;
    name: string;
}

const NavbarCourses = ({ data }: NavbarCourseProps) => {
    const currentPath = usePathname();

    const isAdmin = currentPath.includes("/Administrador");
    const isStudent = currentPath.includes("/Alumno");
    const basePath = isAdmin
        ? '/Administrador/Grupos'
        : isStudent
            ? '/Alumno'
            : '/Profesor';

    return (
        <div className={style.navbarCourseContainer}>
            {data.length === 0 ? (
                <p className={style.emptyText}>No hay cursos</p>
            ) : (
                data.map((course) => (
                    <Link key={course.id} href={`${basePath}/${course.id}`} className={style.courseCard}>
                        <div className={style.cardHeader}></div>
                        <div className={style.cardBody}>
                            <p className={style.courseName}>{course.name}</p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default NavbarCourses;
