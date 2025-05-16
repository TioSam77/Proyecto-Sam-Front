'use client'
import { usePathname } from "next/navigation";
import TableAttendance from "@/app/componets/course/TableAttendance";

export default function Page() {
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");
    pathSegments.pop();

    return (
        <TableAttendance />
    )
}