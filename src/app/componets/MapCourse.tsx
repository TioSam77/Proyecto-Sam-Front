"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { courses } from "@/app/data/courses"
import { useState } from "react";

import styleCourse from "../css/Course.module.css";
import styleUser from "../css/User.module.css";

const MapCourse = () => {
    const currentPath = usePathname();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={styleCourse.center}>
            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <Link href={`${currentPath}/Crear`}>
                    <button className={styleUser.button}>Nuevo Grupo</button>
                </Link>
            </div>
            <ol className={styleCourse.containerSubjects}>
                {courses.map((course) => (
                    <li key={course.id} className={styleCourse.subjects}>
                        <div className={styleCourse.header}>
                            <Link href={`${currentPath}/${course.id}`}>
                                <div className={styleCourse.image}></div>
                                <h2 className={styleCourse.textHeader}>{course.name}</h2>
                            </Link>
                        </div>
                        <div className={styleCourse.body}>
                            <h5>Información sobre {course.name}</h5>
                        </div>
                        <div className={styleCourse.footer}>
                            <h5>Más detalles</h5>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default MapCourse;
