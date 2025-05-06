'use client'
import React, { useEffect, useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { db ,auth} from '../../../../firebase/clientApp';

const ViewTeacher = () => {
  const [showCourses, setShowCourses] = useState(false);

  const teacher = {
    name: 'María González',
    email: 'maria.gonzalez@universidad.edu',
    department: 'Matemáticas',
    phone: '+52 55 1234 5678',
    office: 'Edificio A, oficina 204',
    bio: 'Profesora con más de 10 años de experiencia en cálculo y álgebra lineal. Apasionada por la enseñanza y la tecnología educativa.'
  };

  const [data, setData] = useState<any[]>([]);
  const [login, setLogin] = useState<boolean>(false)
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
              setData([]);
              return;
          }

          try {
              setLogin(true);
              const q = query(collection(db, "course"));
              const querySnapshot = await getDocs(q);

              const allData = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data()
              }));

              setData(allData);
              setNotFound(allData.length === 0);
          } catch (err) {
              console.error("Error al obtener cursos:", err);
              setNotFound(true);
          } finally {
              setLogin(false);
          }
      });

      return () => unsubscribe();
  }, []);

  return (
    <div className={styleTeacher.teacherCard}>
      <h2 className={styleTeacher.teacherName}>{teacher.name}</h2>
      <p className={styleTeacher.teacherBio}>{teacher.bio}</p>
      <div className={styleTeacher.teacherDetails}>
        <p><strong>Correo:</strong> {teacher.email}</p>
        <p><strong>Departamento:</strong> {teacher.department}</p>
        <p><strong>Teléfono:</strong> {teacher.phone}</p>
        <p><strong>Oficina:</strong> {teacher.office}</p>
      </div>
      <hr></hr>
      <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: "pointer" }}>
        Cursos asignados {showCourses ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
      </h3>
      {showCourses && (
        <MapCourse data={data} login={login} notFound={notFound} />
      )}
    </div>
  );
};

export default ViewTeacher;
