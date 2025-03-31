"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styleUser from "../css/User.module.css";

const users = [
    { id: "u1", name: "Paola" },
    { id: "u2", name: "Amelia" },
    { id: "u3", name: "Carlos" },
    { id: "u4", name: "Lucía" }
];

const MapUser = () => {
    const currentPath = usePathname();

    return (
        <section className={styleUser.center}>
            <ol className={styleUser.containerUsers}>
                {users.map((user) => (
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
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default MapUser;
