"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleCourse from "../css/Course.module.css";


const courses = [
    { id: "1a2b3c", name: "Inglés" },
    { id: "4d5e6f", name: "Matemáticas" },
    { id: "7g8h9i", name: "Historia" },
    { id: "0j1k2l", name: "Ciencias" }
];

const MapCourse = () => {
    const currentPath = usePathname();

    return (
        <section className={styleCourse.center}>
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
