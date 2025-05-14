"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavbarCourses from "./course/NavbarCourses";

const Header = () => {

  const handleLogout = () => {

  };

  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1];

  const isAdminPage = firstSegment === "Administrador";
  const isStudentPage = firstSegment === "Alumno";
  const isTeacherPage = firstSegment === "Profesor";

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

            {(!isStudentPage && !isTeacherPage && !isAdminPage) && (
              <li className="nav-item">
                <Link className="nav-link" href="/Login">
                  <i className="bi bi-box-arrow-in-right me-2 text-dark"></i>Acceder
                </Link>
              </li>
            )}

            {isTeacherPage && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Profesor">
                    <i className="bi bi-easel-fill me-2 text-dark"></i>Profesor
                  </Link>
                </li>
                
                <NavbarCourses/>
              </>
            )}

            {isStudentPage && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Alumno">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Alumno
                  </Link>
                </li>

                <NavbarCourses />
              </>
            )}


            {isAdminPage && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/Administrador">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Administrador
                  </Link>
                </li>

                <li className="nav-item containerLink">
                  <Link className="nav-link" href="/Administrador/Alumnos">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Alumnos
                  </Link>
                  <i className="bi bi-caret-down-fill"></i>
                </li>

                <li className="nav-item containerLink">
                  <Link className="nav-link " href="/Administrador/Grupos">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Grupos
                  </Link>
                  <i className="bi bi-caret-down-fill"></i>
                </li>

                <li className="nav-item containerLink">
                  <Link className="nav-link" href="/Administrador/Profesores">
                    <i className="bi bi-mortarboard-fill me-2 text-dark"></i>Profesores
                  </Link>
                  <i className="bi bi-caret-down-fill"></i>
                </li>

              </>
            )}

            <button className="nav-item containerLink nav-link" onClick={handleLogout}>
              <i className="bi bi-gear-fill me-2 "></i>Cerrar cesion
            </button>

          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;