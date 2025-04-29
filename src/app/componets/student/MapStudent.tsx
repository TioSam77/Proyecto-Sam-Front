"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleUser from "@/app/css/User.module.css";
import { initialData } from "@/app/data/student";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/../firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";

const MapStudent = () => {
    const [searchTerm, setSearchTerm] = useState<any>("");
    const currentPath = usePathname();
    const [data, setData] = useState<any[]>([]);
    const [login,setLogin] = useState<boolean>(false)

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
                <Link href={`${currentPath}/Registro`}>
                    <button className={styleUser.button}>Nuevo Alumno</button>
                </Link>
            </div>

            {login && (
                <div>Cargando</div>
            )}
            
            <ol className={styleUser.containerUsers}>
                {filteredUsers.map((user) => (
                    <li key={user.id} className={styleUser.users}>
                        <div className={styleUser.header}>
                            <Link href={`${currentPath}/${user.id}`}>
                                <h2 className={styleUser.textHeader}>{user.name}</h2>
                            </Link>
                        </div>
                        <div className={styleUser.body}>
                            <h5>Información sobre {user.name}</h5>
                        </div>

                        <div className={styleUser.footer}>
                            <h5>Más detalles</h5>
                        </div>

                        {isAdmin && (
                            <div className={styleUser.containerButton}>
                                <button className="bluebutton">Editar</button>
                                <button className="redbutton">Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default MapStudent;
