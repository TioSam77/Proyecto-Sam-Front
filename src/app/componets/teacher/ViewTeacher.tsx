'use client'
import React, { useState } from 'react';
import styleTeacher from "@/app/css/viewTeacher.module.css";
import MapCourse from '../course/MapCourse';

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
        <MapCourse />
      )}
    </div>
  );
};

export default ViewTeacher;
