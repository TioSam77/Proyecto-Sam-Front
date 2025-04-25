'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import card from "@/app/css/card.module.css";

interface LinkCardProps {
    name: string,
    url: string,
    icon: string,
}

const LinkCard: React.FC<LinkCardProps> = ({ name, url, icon }) => {
    const pathname = usePathname();
    const isActive = pathname === url;

    return (
        <Link href={url}
            className={`${card.card} ${isActive ? card.active : ''}`}
        >
            <h3>{name}</h3>
            <i className={icon}></i>
        </Link>
    );
}

export default LinkCard;
