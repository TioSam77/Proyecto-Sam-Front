"use client";
'use client';

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Header = () => {
  const handleLogout = () => {
    // Aquí puedes limpiar el estado del usuario, eliminar el token, etc.
    localStorage.removeItem("token"); // Ejemplo si usas JWT
    window.location.href = "/Login"; // Redirige al usuario a la página de login
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center " href="/">
            <img src="/logo.jpg" alt="Interactivo Logo" height="40" className="me-2" />
            <h3 className="logo">Interactivo</h3>
          </a>

          {/* Botón de mensajes */}
          <button
            className="btn "
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMessages"
            aria-controls="offcanvasMessages"
          >
            <i className="bi bi-chat-dots" style={{ fontSize: '1.5rem' }}></i>
          </button>

          {/* Botón del menú lateral */}
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
      </nav>

      {/* Menú de mensajes */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasMessages"
        aria-labelledby="offcanvasMessagesLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasMessagesLabel">Mensajes</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="accordion" id="accordionMessages">
            {/* Destacados */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  Destacados (1)
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionMessages"
              >
                <div className="accordion-body">
                  <strong>Loza Dulce</strong> — Tareas de IBM 📚
                </div>
              </div>
            </div>

            {/* Grupo */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Grupo (0)
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionMessages"
              >
                <div className="accordion-body">
                  Sin conversaciones grupales
                </div>
              </div>
            </div>

            {/* Privado */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Privado (2)
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionMessages"
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    <li><strong>Eduardo Eloy</strong> — “Buenas tardes…”</li>
                    <li><strong>Samuel Wajsfeld</strong> — “Ya entregué el reporte.”</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú lateral */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            Menú
          </h5>
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
              <a className="nav-link active" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Login">Acceder</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Registro">Registrarse</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Profesor">Profesor</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Alumno">Alumno</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
