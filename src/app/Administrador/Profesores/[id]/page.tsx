import EditTeacher from "@/app/componets/teacher/EditTeacher";
import ViewTeacher from "@/app/componets/teacher/ViewTeacher";
import ViewAdmin from "../../../componets/admin/ViewAdmin";

export default function Page() {
  return (
    <>
      <ViewTeacher />
      <ViewAdmin/>
      <EditTeacher />
    </>
  )
}