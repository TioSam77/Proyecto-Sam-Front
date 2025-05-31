'use client'
import React, { useEffect, useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface data {
  id: string
  name: string
  teacher_name: string
}

interface teacher {
  id: string,
  name?: string,
  name2?: string,
  surname?: string,
  surname2?: string,
  email?: string,
  phoneNumber?: string,
  position?: string,
  role?: number
}

const ViewTeacher = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [teacherData, setTeacherData] = useState<teacher | null>(null);
  const [data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const teacherId = segments[3]; // Ajusta esto según tu estructura de URL

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/teacher/${teacherId}`);
        if (!res.ok) throw new Error("No se pudo obtener el profesor");

        const data = await res.json();
        setTeacherData(data);
      } catch (err) {
        console.error("Error al obtener datos del profesor:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);


  // Cargar cursos solo cuando se muestra la sección
  useEffect(() => {
    const fetchCourses = async () => {
      if (!showCourses || data.length > 0) return;

      try {
        setLoadingCourses(true);
        const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-teacherCourse/${teacherId}`);
        if (!res.ok) throw new Error("No se pudieron obtener los cursos");

        const courses = await res.json();
        setData(courses);
      } catch (err) {
        console.error("Error al obtener cursos:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [showCourses, teacherId, data.length]);


  if (notFound) return <p>Profesor no encontrado.</p>;
  if (loading) return <p>Cargando...</p>;

  const getRoleName = (role?: number): string => {
    switch (role) {
      case 1:
        return 'Super Administrador';
      case 2:
        return 'Administrador';
      case 3:
        return 'Profesor Inglés';
      default:
        return 'desconocido';
    }
  };

  return (
    <div className={styleTeacher.teacherCard}>
      <div className={styleTeacher.headerButton}>
        <h3 className={styleTeacher.teacherName}>
          {(teacherData?.surname && teacherData?.name)
            ? `${teacherData.surname} ${teacherData.surname2} ${teacherData.name} ${teacherData.name2}`
            : 'Nombre del profesor'}
        </h3>
        <Link href={`/Administrador/Profesores/${teacherId}/Editar`}>
          <button className="bluebutton">Editar</button>
        </Link>
      </div>

      <div className={styleTeacher.teacherDetails}>
        <p><strong>Correo:</strong> {teacherData?.email || '-'}</p>
        <p><strong>Teléfono:</strong> {teacherData?.phoneNumber || '-'}</p>
        <p><strong>Puesto:</strong> {teacherData?.position || '-'}</p>
        <p><strong>Rol:</strong> {getRoleName(teacherData?.role)}</p>
      </div>
      <hr />
      <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: "pointer" }}>
        Cursos asignados {showCourses ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
      </h3>
      {showCourses && (
        <MapCourse data={data} login={loadingCourses} notFound={notFound} show={false}/>
      )}
    </div>
  );
};

export default ViewTeacher;
