'use client'
import React, { useEffect, useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export interface StudentData {
  id: string;
  name?: string;
  name2?: string;
  surname?: string;
  surname2?: string;
  email?: string;
  bio?: string;
  matricula?: string;
  career?: string;
  phoneNumber?: string;
  heardFrom?: string;
  teacherNote?: string;
}

interface course {
  id: string,
  name: string
  teacher_name: string
}

const ViewStudent = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const params = useParams();
  const studentId = params?.id as string;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api-uj4mkoe42a-uc.a.run.app/student/${studentId}`
        );

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setStudentData(data);
      } catch (err) {
        console.error("Error al obtener datos del estudiante:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleToggleCourses = async () => {
    setShowCourses(prev => !prev);

    if (!showCourses && courses.length === 0) {
      try {
        setLoadingCourses(true);

        const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-studentCourse/${studentId}`);
        if (!res.ok) throw new Error("No se pudieron obtener los cursos");

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error al obtener cursos del estudiante:", err);
        setNotFound(true);
      } finally {
        setLoadingCourses(false);
      }
    }
  };

  if (notFound) return <p>Estudiante no encontrado.</p>;
  if (loading) return <p>Cargando datos del estudiante...</p>;

  return (
    <div className={styleTeacher.teacherCard}>
      <div className={styleTeacher.headerButton}>
        <h3 className={styleTeacher.teacherName}>
          {(studentData?.surname || studentData?.name)
            ? [studentData?.surname, studentData?.surname2, studentData?.name, studentData?.name2]
              .filter(Boolean)
              .join(' ')
            : 'Nombre del estudiante'}
        </h3>
        <Link href={`${studentId}/Editar`}>
          <button className='bluebutton'>Editar</button>
        </Link>
      </div>

      <div className={styleTeacher.teacherDetails}>
        <p><strong>Correo:</strong> {studentData?.email || '-'}</p>
        <p><strong>Teléfono:</strong> {studentData?.phoneNumber || '-'}</p>
        <p><strong>¿Cómo se enteró?:</strong> {studentData?.heardFrom || '-'}</p>
        <p><strong>Nota del profesor:</strong> {studentData?.teacherNote || '-'}</p>
      </div>

      <hr />
      <h3 onClick={handleToggleCourses} style={{ cursor: "pointer" }}>
        Cursos inscritos {showCourses ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
      </h3>
      {showCourses && (
        <MapCourse data={courses} login={loadingCourses} notFound={notFound} show={false}/>
      )}
    </div>

  );
};

export default ViewStudent;
