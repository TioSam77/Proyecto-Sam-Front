'use client'
import style from "@/app/css/Teacher.module.css"
import { usePathname } from "next/navigation";
import TableAttendance from "@/app/componets/course/TableAttendance";

export default function Page() {
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");
    pathSegments.pop();

    return (
        <>
            <section className={style.infoHead}>
                <TableAttendance />
            </section>
        </>
    )
}