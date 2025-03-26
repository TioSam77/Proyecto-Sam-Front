"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const HeaderAlumno = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/Login";
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="/Alumno">
            <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
            <h3 className="logo">Interactivo</h3>
          </a>

          <button
            className="btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMessages"
            aria-controls="offcanvasMessages"
          >
            <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.5rem' }}></i>
          </button>

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

      {/* PANEL DE MENSAJES - ALUMNO */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasMessages">
        <div className="offcanvas-header">
          <h5>Mensajes</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="accordion" id="accordionMessages">
            {/* Destacados */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#adminMessages">
                  <i className="bi bi-megaphone-fill me-2 text-danger"></i> Destacados (1)
                </button>
              </h2>
              <div id="adminMessages" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <strong>Admin</strong> — Aviso importante sobre los exámenes
                </div>
              </div>
            </div>

            {/* Grupo - SOLO VER */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#groupMessages">
                  <i className="bi bi-people-fill me-2 text-primary"></i> Grupo (2)
                </button>
              </h2>
              <div id="groupMessages" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <h6 className="mb-3">Mensajes Grupales</h6>
                  <ul className="list-group">
                    <li className="list-group-item">
                      “Estudien para el parcial de mañana”
                    </li>
                    <li className="list-group-item">
                      “Recuerden entregar la tarea de lógica”
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privado - Manda y recibe */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#privateMessages">
                  <i className="bi bi-chat-left-dots-fill me-2 text-warning"></i> Privado (2)
                </button>
              </h2>
              <div id="privateMessages" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    <li><strong>Yo:</strong> “No podré asistir hoy, profesor.”</li>
                    <li><strong>Profe Samuel:</strong> “Gracias por avisar.”</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NAVBAR lateral para alumno */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar">
        <div className="offcanvas-header">
          <h5>Menú</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/Alumno">Atrás</a>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HeaderAlumno;
