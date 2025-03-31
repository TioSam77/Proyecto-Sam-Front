"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const HeaderProfesor = () => {
  const [mensajesGrupo, setMensajesGrupo] = useState<string[]>([
    "Estudien para el parcial de mañana",
    "Recuerden entregar la tarea de lógica"
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/Login";
  };

  const handleSendGroupMessage = () => {
    const nuevo = prompt("Escribe el nuevo mensaje grupal:");
    if (nuevo) {
      setMensajesGrupo([...mensajesGrupo, nuevo]);
    }
  };

  const handleDeleteMessage = (index: number) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este mensaje?");
    if (confirmDelete) {
      const copia = [...mensajesGrupo];
      copia.splice(index, 1);
      setMensajesGrupo(copia);
    }
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="/Profesor">
            <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
            <h3 className="logo">Interactivo</h3>
          </a>

          <div>
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
        </div>
      </nav>

      {/* MENSAJES DEL PROFESOR */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasMessages">
        <div className="offcanvas-header">
          <h5>Mensajes</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="accordion" id="accordionMessages">

            {/* Destacados */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#adminMessages">
                  <i className="bi bi-megaphone-fill me-2 text-danger"></i> Destacados (1)
                </button>
              </h2>
              <div id="adminMessages" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <strong>Admin</strong> — Cambios en horario general
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
                >
                  <i className="bi bi-people-fill me-2 text-primary"></i> Grupo ({mensajesGrupo.length})
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0">Mensajes Grupales</h6>
                    <button className="btn btn-primary btn-sm" onClick={handleSendGroupMessage}>
                      <i className="bi bi-plus-circle me-1"></i> Nuevo Mensaje
                    </button>
                  </div>

                  {mensajesGrupo.length === 0 ? (
                    <p className="text-muted">Sin conversaciones grupales</p>
                  ) : (
                    <ul className="list-group">
                      {mensajesGrupo.map((mensaje, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          “{mensaje}”
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteMessage(index)}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Privado */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#privateMessages">
                  <i className="bi bi-chat-left-dots-fill me-2 text-warning"></i> Privado (2)
                </button>
              </h2>
              <div id="privateMessages" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    <li><strong>Samuel Wajsfeld</strong> — “Tengo una duda del parcial.”</li>
                    <li><strong>Profe Samuel</strong> — “Claro, revisamos en clase.”</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NAVBAR lateral */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar">
        <div className="offcanvas-header">
          <h5>Menú</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/Profesor">Atrás</a>
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

export default HeaderProfesor;
