'use client'
import React, { useEffect, useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase/clientApp';
import { usePathname } from 'next/navigation';

interface studentData {
  id: string
  name?: string,
  surname?: string,
  email?: string,
  bio?: string,
  matricula?: string,
  career?: string,
  phoneNumber?: string
}

interface course {
  id: string,
  name: string
}

const ViewStudent = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [studentData, setStudentData] = useState<studentData | null>(null);
  const [courses, setCourses] = useState<course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const studentId = segments[3]; // Ajusta esto si el ID está en otra parte

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const studentRef = doc(db, 'student', studentId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setNotFound(true);
          return;
        }

        setStudentData({ id: studentSnap.id, ...studentSnap.data() });
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

        // 1. Buscar inscripciones del alumno
        const q = query(collection(db, 'student_course'), where('student_id', '==', studentId));
        const scSnapshot = await getDocs(q);
        const courseIds = scSnapshot.docs.map(doc => doc.data().course_id);

        // 2. Traer datos de cada curso
        const coursePromises = courseIds.map(id => getDoc(doc(db, 'course', id)));
        const courseDocs = await Promise.all(coursePromises);

        const fullCourses = courseDocs
          .filter(doc => doc.exists())
          .map(doc => {
            const docData = doc.data();
            return {
              id: doc.id,
              name: docData.name,
            };
          });

        setCourses(fullCourses);
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
          {(studentData?.surname && studentData?.name)
            ? `${studentData.surname} ${studentData.name}`
            : 'Nombre del estudiante'}
        </h3>
        <button className='bluebutton'>Editar</button>
      </div>

      <p className={styleTeacher.teacherBio}>{studentData?.bio || 'Descripción no disponible.'}</p>
      <div className={styleTeacher.teacherDetails}>
        <p><strong>Correo:</strong> {studentData?.email || '-'}</p>
        <p><strong>Matrícula:</strong> {studentData?.matricula || '-'}</p>
        <p><strong>Teléfono:</strong> {studentData?.phoneNumber || '-'}</p>
        <p><strong>Carrera:</strong> {studentData?.career || '-'}</p>
      </div>
      <hr />
      <h3 onClick={handleToggleCourses} style={{ cursor: "pointer" }}>
        Cursos inscritos {showCourses ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
      </h3>
      {showCourses && (
        <MapCourse data={courses} login={loadingCourses} notFound={notFound} />
      )}
    </div>
  );
};

export default ViewStudent;
