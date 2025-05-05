"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/../firebase/clientApp";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import DeleteConfirm from "@/app/componets/DeleteConfirm";

const MapTeacher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [login, setLogin] = useState<boolean>(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        setLogin(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLogin(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, "teacher"));
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

    const filteredUsers = data.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: { id: string, name: string }) => {
        setSelectedTeacher(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedTeacher) return;
    
        try {
            // Verificar si hay algún curso con ese teacher_id
            const courseQuery = query(
                collection(db, "course"),
                where("teacher_id", "==", selectedTeacher.id)
            );
            const courseSnapshot = await getDocs(courseQuery);
    
            if (!courseSnapshot.empty) {
                alert("No se puede eliminar al profesor porque está asignado a uno o más cursos.");
                return;
            }
    
            // Si no tiene cursos, se puede eliminar
            await deleteDoc(doc(db, "teacher", selectedTeacher.id));
            setData(prev => prev.filter(user => user.id !== selectedTeacher.id));
        } catch (err) {
            console.error("Error al eliminar:", err);
        } finally {
            setShowModal(false);
            setSelectedTeacher(null);
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
                <Link href={`/Administrador/Profesores/Registro`}>
                    <button className={styleUser.button}>Nuevo Profesor</button>
                </Link>
            </div>

            {login && (
                <div>Cargando</div>
            )}

            <ol className={styleUser.containerUsers}>
                {filteredUsers.map((user) => (
                    <li key={user.id} className={styleUser.users}>
                        <div className={styleUser.header}>
                            <Link href={`/Administrador/Profesores/${user.id}`}>
                                <h2 className={styleUser.textHeader}>{user.name}</h2>
                            </Link>
                        </div>
                        <div className={styleUser.body}>
                            <h5>Información sobre {user.name}</h5>
                        </div>
                        <div className={styleUser.footer}>
                            <h5>Más detalles</h5>
                        </div>

                        <div className={styleUser.containerButton}>
                            <button className="bluebutton">Editar</button>
                            <button className="redbutton" onClick={() => handleDeleteClick(user)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ol>

            {showModal && selectedTeacher && (
                <DeleteConfirm
                    name={selectedTeacher.name}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedTeacher(null);
                    }}
                />
            )}

        </section>
    );
};

export default MapTeacher;
