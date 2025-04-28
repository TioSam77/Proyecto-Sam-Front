"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleUser from "@/app/css/User.module.css";
import { teacher } from "@/app/data/teacher";

const MapTeacher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const currentPath = usePathname();

    const filteredUsers = teacher.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={styleUser.center}>

            <div style={{display:"flex", gap:"10px", width:"100%", justifyContent:"center"}}>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
                <Link href={`${currentPath}/Registro`}>
                    <button className={styleUser.button}>Nuevo Profesor</button>
                </Link>
            </div>
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

                        <div className={styleUser.containerButton}>
                            <button className="bluebutton">Editar</button>
                            <button className="redbutton">Eliminar</button>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default MapTeacher;
