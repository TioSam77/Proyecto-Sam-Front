"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/../firebase/clientApp";
import DeleteConfirm from "@/app/componets/DeleteConfirm";

interface data {
    id: string,
    name: string,
    name2: string,
    surname: string,
    surname2: string,
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
                const res = await fetch("https://api-uj4mkoe42a-uc.a.run.app/get-employee");
                if (!res.ok) throw new Error("Error en la respuesta del servidor");

                const allData: data[] = await res.json();
                setData(allData);
            } catch (err) {
                console.error("Error al obtener profesores:", err);
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
            const res = await fetch(
                `https://api-uj4mkoe42a-uc.a.run.app/delete-teacher/${selectedTeacher.id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || "Error al eliminar al profesor.");
                return;
            }

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
