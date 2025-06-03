"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/../firebase/clientApp";
import DeleteConfirm from "../DeleteConfirm";

interface data {
    id: string;
    name: string;
    name2: string;
    surname: string;
    surname2: string;
    phoneNumber: string;
}

interface SearchedUser {
    uid: string;
    name: string;
}

const MapStudent = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const currentPath = usePathname();
    const [data, setData] = useState<data[]>([]);
    const [login, setLogin] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
    const [message, setMessage] = useState<string>("");

    const isAdmin = currentPath.includes("/Administrador");

    useEffect(() => {
        setLogin(true);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setData([]);
                setLogin(false);
                return;
            }

            try {
                const res = await fetch("https://api-uj4mkoe42a-uc.a.run.app/get-student");
                if (!res.ok) throw new Error("Error en la respuesta del servidor");

                const allData: data[] = await res.json();
                setData(allData);
            } catch (err) {
                console.error("Error al obtener estudiantes:", err);
            } finally {
                setLogin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteClick = (user: { id: string; name: string }) => {
        setSelectedStudent(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedStudent) return;

        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/delete-student/${selectedStudent.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error eliminando estudiante");
            }

            setData(prev => prev.filter(user => user.id !== selectedStudent.id));
        } catch (err) {
            console.error("Error al eliminar:", err);
        } finally {
            setShowModal(false);
            setSelectedStudent(null);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setMessage("Escribe un nombre para buscar");
            return;
        }

        setLogin(true);
        setMessage("");

        try {
            const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/search?tab=students&searchTerm=${encodeURIComponent(searchTerm)}`);
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Error al buscar estudiantes");

            const results = json.users.map((user: SearchedUser) => {
                const [surname = "", surname2 = "", name = "", name2 = ""] = user.name.split(" ");
                return {
                    id: user.uid,
                    name,
                    name2,
                    surname,
                    surname2,
                    phoneNumber: "", // no viene en la búsqueda, se deja vacío
                };
            });

            setData(results);

            if (results.length === 0) {
                setMessage("No se encontraron estudiantes con ese nombre");
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
            setMessage("Ocurrió un error al buscar");
        } finally {
            setLogin(false);
        }
    };

    return (
        <section className={styleUser.center}>
            <div style={{ display: "flex", gap: "10px" }}>
                <Link href={`/Administrador/Alumnos/Registro`}>
                    <button className={styleUser.button}>Nuevo Alumno</button>
                </Link>
                <Link href={`/Administrador/Alumnos/Carga`}>
                    <button className={styleUser.button}>Carga masiva de alumnos</button>
                </Link>
            </div>

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center", marginTop: "1rem" }}>
                <input
                    type="text"
                    placeholder="Buscar estudiante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <button className="bluebutton" onClick={handleSearch}>Buscar</button>
            </div>

            {login && <div>Cargando...</div>}
            {message && <p>{message}</p>}

            <ol className={styleUser.containerUsers}>
                {data.map((user) => (
                    <li key={user.id} className={styleUser.users}>
                        <Link href={`/Administrador/Alumnos/${user.id}`}>
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

                        {isAdmin && (
                            <div className={styleUser.containerButton}>
                                <Link href={`/Administrador/Alumnos/${user.id}/Editar`}>
                                    <button className="bluebutton">Editar</button>
                                </Link>
                                <button className="redbutton" onClick={() => handleDeleteClick(user)}>
                                    <i className="bi bi-trash-fill"></i>
                                </button>
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
