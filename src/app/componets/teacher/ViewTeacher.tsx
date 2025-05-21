'use client'
import React, { useEffect, useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/../firebase/clientApp';
import { usePathname } from 'next/navigation';

interface data {
  id: string
  name: string
}

interface teacher {
  id: string,
  name?: string,
  surname?: string,
  email?: string,
  phoneNumber?: string,
  bio?: string,
  office?: string,
  department?: string
}

const ViewTeacher = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [teacherData, setTeacherData] = useState<teacher | null>(null);
  const [data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const teacherId = segments[3]; // Ajusta esto según tu estructura de URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Traer datos del profesor
        const teacherRef = doc(db, 'teacher', teacherId);
        const teacherSnap = await getDoc(teacherRef);

        if (!teacherSnap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const teacher = {
          id: teacherSnap.id,
          ...teacherSnap.data(),
        };
        setTeacherData(teacher);
        console.log(teacher)

        // 2. Traer cursos donde teacher_id == teacherId
        const q = query(collection(db, 'course'), where('teacher_id', '==', teacherId));
        const querySnapshot = await getDocs(q);
        const courses: data[] = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            name: docData.name,
          };
        });

        setData(courses);

      } catch (err) {
        console.error("Error al obtener datos:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  if (notFound) return <p>Profesor no encontrado.</p>;
  if (loading) return <p>Cargando...</p>;

  return (
    <div className={styleTeacher.teacherCard}>
      <div className={styleTeacher.headerButton}>
        <h3 className={styleTeacher.teacherName}>
          {(teacherData?.surname && teacherData?.name)
            ? `${teacherData.surname} ${teacherData.name}`
            : 'Nombre del profesor'}
        </h3>
        <button className='bluebutton'>Editar</button>
      </div>


      <p className={styleTeacher.teacherBio}>{teacherData?.bio || 'Descripción no disponible.'}</p>
      <div className={styleTeacher.teacherDetails}>
        <p><strong>Correo:</strong> {teacherData?.email || '-'}</p>
        <p><strong>Departamento:</strong> {teacherData?.department || '-'}</p>
        <p><strong>Teléfono:</strong> {teacherData?.phoneNumber || '-'}</p>
        <p><strong>Oficina:</strong> {teacherData?.office || '-'}</p>
      </div>
      <hr />
      <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: "pointer" }}>
        Cursos asignados {showCourses ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
      </h3>
      {showCourses && (
        <MapCourse data={data} login={loading} notFound={notFound} />
      )}
    </div>
  );
};

export default ViewTeacher;
