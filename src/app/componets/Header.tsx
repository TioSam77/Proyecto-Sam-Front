"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavbarCourses from "./course/NavbarCourses";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [enrroled, setEnrroled] = useState(false)

  const [userRole, setUserRole] = useState<"superAdmin" | "admin" | "teacher" | "student" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const teacherRef = doc(db, "teacher", user.uid);
        const teacherSnap = await getDoc(teacherRef);

        if (teacherSnap.exists()) {
          const role = teacherSnap.data().role;
          if (role === 1) setUserRole("superAdmin");
          else if (role === 2) setUserRole("admin");
          else if (role === 3) setUserRole("teacher");
          else setUserRole("student");
        } else {
          setUserRole("student");
        }
        setEnrroled(true);
      } else {
        setUserRole(null);
        setEnrroled(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userRole === "admin" || userRole === "superAdmin";
  const isTeacher = userRole === "teacher";
  const isStudent = userRole === "student";
  const isSuperAdmin = userRole === "superAdmin";

  const handleLogout = async () => {
    await signOut(auth);
    setEnrroled(false);
  };

  return (
    <>
      {/* Barra de navegación */}
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <Image src="/logo.jpg" alt="Interactivo Logo" height="40" width="40" className="me-2" />
            <h3 className="logo">Interactivo</h3>
          </Link>

          <div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

        </div>
      </nav>

      {/* NAVBAR lateral */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">

            <li className="nav-item">
              <Link className="nav-link active" href="/">
                <i className="bi bi-house-door-fill me-2 text-dark"></i>Inicio
              </Link>
            </li>

            {!enrroled && (
              <li className="nav-item">
                <Link className="nav-link" href="/Login">
                  <i className="bi bi-box-arrow-in-right me-2 text-dark"></i>Acceder
                </Link>
              </li>
            )}

            {isTeacher && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Profesor">
                    <i className="bi bi-easel-fill me-2 text-dark"></i>Profesor
                  </Link>
                </li>

                <NavbarCourses />
              </>
            )}

            {isStudent && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Alumno">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Alumno
                  </Link>
                </li>

                <NavbarCourses />
              </>
            )}

            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Administrador">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Administrador
                  </Link>
                </li>
              </>
            )}

            {enrroled &&
              <Link className="nav-link" href="/Login" onClick={handleLogout}>
                <i className="bi bi-gear-fill me-2 "></i>Cerrar sesion
              </Link>
            }

          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;