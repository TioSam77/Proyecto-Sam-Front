"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/../firebase/clientApp";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import DeleteConfirm from "@/app/componets/DeleteConfirm";

interface data {
    id: string,
    name: string,
    name2:string,
    surname:string,
    surname2:string,
    phoneNumber: string
}

const MapTeacher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<data[]>([]);
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
                const allData: data[] = querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        name: docData.name,
                        name2: docData.name2,
                        surname: docData.surname,
                        surname2: docData.surname2,
                        phoneNumber: docData.phoneNumber
                    };
                });

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

            <div style={{ display: "flex", gap: "10px" }}>
                <Link href={`/Administrador/Profesores/Registro`}>
                    <button className={styleUser.button}>Nuevo Empleado</button>
                </Link>
                <Link href={`/Administrador/Profesores/Carga`}>
                    <button className={styleUser.button}>Carga masiva de Empleados</button>
                </Link>
            </div>

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center" }}>
                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton">Buscar</button>
            </div>

            {login && (
                <div>Cargando</div>
            )}

            <ol className={styleUser.containerUsers}>
                {filteredUsers.map((user) => (
                    <li key={user.id} className={styleUser.users}>
                        <Link href={`/Administrador/Profesores/${user.id}`}>
                            <div className={styleUser.header}>
                                <h2 className={styleUser.textHeader}>{user.surname} {user.surname2}</h2>
                            </div>
                            <div className={styleUser.header}>
                                <h2 className={styleUser.textHeader}>{user.name} {user.name2}</h2>
                            </div>
                            <div className={styleUser.body}>
                                <p>{user.phoneNumber}</p>
                            </div>
                        </Link>

                        <div className={styleUser.containerButton}>
                            <Link href={`/Administrador/Profesores/${user.id}/Editar`}>
                                <button className="bluebutton">Editar</button>
                            </Link>
                            <button className="redbutton" onClick={() => handleDeleteClick(user)}><i className="bi bi-trash-fill"></i></button>
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
