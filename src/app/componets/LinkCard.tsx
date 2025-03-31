'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import card from "@/app/css/card.module.css";

interface LinkCardProps {
    name: string,
    icon: string,
}

const LinkCard: React.FC<LinkCardProps> = ({ name, icon }) => {
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const basePath = pathSegments.slice(0, -1).join("/");
    
    const keywords = ["Asistencia", "Calificaciones", "Temario","Grupos","Alumnos","Profesores"];
    const useBasePath = keywords.includes(lastSegment);
    
    const formattedName = name.replace(/\s+/g, "-");
    return (
        <Link href={`${useBasePath ? basePath : currentPath}/${formattedName}`} className={card.card}>
            <h3>{name}</h3>
            <i className={icon}></i>
        </Link>
    );
}

export default LinkCard;
