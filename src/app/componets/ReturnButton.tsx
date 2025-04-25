'use client';

import styleButton from "@/app/css/ReturnButton.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ReturnButton = () => {
    const pathname = usePathname();
    const segments = pathname.split("/").slice(0, -1);
    const url = segments.join("/");

    if (pathname === "/Administrador") {
        return null;
    }

    return (
        <Link href={url} className={styleButton.container}>
            <button className={styleButton.returnButton}>
                <i className="bi bi-arrow-return-left"></i> Regresar
            </button>
        </Link>
    );
};

export default ReturnButton;
