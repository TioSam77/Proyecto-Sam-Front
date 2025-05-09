"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/../firebase/clientApp";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import DeleteConfirm from "../DeleteConfirm";

const MapStudent = () => {
    const [searchTerm, setSearchTerm] = useState<any>("");
    const currentPath = usePathname();
    const [data, setData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false)
    const [_student, setStudent] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);


    useEffect(() => {
        setLogin(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLogin(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, "student"));
                const allData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(allData);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);


    const isAdmin = currentPath.includes('/Administrador')

    const filteredUsers = data.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: { id: string, name: string }) => {
        setSelectedStudent(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedStudent) return;
        try {
            // 1. Eliminar el curso principal
            await deleteDoc(doc(db, "student", selectedStudent.id));

            // 2. Eliminar registros relacionados en student_course
            const studentCoursesSnapshot = await getDocs(
                query(collection(db, "student_course"), where("student_id", "==", selectedStudent.id))
            );
            const deleteStudentCourses = studentCoursesSnapshot.docs.map(docu =>
                deleteDoc(doc(db, "student_course", docu.id))
            );
            await Promise.all(deleteStudentCourses);

            // 4. Actualizar estado local
            setStudent(prev => prev.filter(user => user.id !== selectedStudent.id));
        } catch (err) {
            console.error("Error al eliminar:", err);
        } finally {
            setShowModal(false);
            setSelectedStudent(null);
        }
    };

    return (
        <section className={styleUser.center}>

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton">Buscar</button>
                <Link href={`/Administrador/Alumnos/Registro`}>
                    <button className={styleUser.button}>Nuevo Alumno</button>
                </Link>
            </div>

            {login && (
                <div>Cargando</div>
            )}

            <ol className={styleUser.containerUsers}>
                {filteredUsers.map((user) => (
                    <li key={user.id} className={styleUser.users}>
                        <Link href={`${currentPath}/${user.id}`}>
                            <div className={styleUser.header}>
                                <h2 className={styleUser.textHeader}>{user.name}</h2>
                            </div>
                            <div className={styleUser.body}>
                                <h5>Información sobre {user.name}</h5>
                            </div>
                        </Link>

                        {isAdmin && (
                            <div className={styleUser.containerButton}>
                                <button className="bluebutton">Editar</button>
                                <button className="redbutton" onClick={() => handleDeleteClick(user)}>Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ol>

            {showModal && selectedStudent && (
                <DeleteConfirm
                    name={selectedStudent.name}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </section>
    );
};

export default MapStudent;
