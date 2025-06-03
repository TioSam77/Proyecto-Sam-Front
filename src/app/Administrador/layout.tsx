'use client';

import LinkCard from "@/app/componets/LinkCard";
import React, { useEffect, useState } from "react";
import course from "@/app/css/Course.module.css";
import card from "@/app/css/card.module.css";
import ReturnButton from "../componets/ReturnButton";
import Header from "../componets/Header";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import EmailVerificationChecker from "../componets/EmailVerification";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isAdminSubroute = pathname.match(/^\/Administrador\/(Grupos)\/.+/);
  const isRegistroRuta = [
    "/Administrador/Grupos/Registro",
    "/Administrador/Grupos/CrearMateria",
    "/Administrador/Grupos/EliminarMateria",
    "/Administrador/Alumnos/Registro",
    "/Administrador/Grupos/Carga"
  ].some(route => pathname.startsWith(route)) || /^\/Administrador\/Grupos\/.+\/Editar$/.test(pathname);

  const [userRole, setUserRole] = useState<"superAdmin" | "admin" | "teacher" | "student" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const role = tokenResult.claims.role;

        switch (role) {
          case "superAdmin":
          case "admin":
          case "teacher":
          case "student":
            setUserRole(role);
            break;
          default:
            setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isSuperAdmin = userRole === "superAdmin";

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAdminSubroute && !isRegistroRuta) {
    return (
      <section className="containerSection">
        <EmailVerificationChecker />
        <Header />
        {children}
      </section>
    );
  }

  return (
    <section className="containerSection">
      <EmailVerificationChecker />
      <ReturnButton />
      <Header />
      <section className={course.center}>
        <div className={card.containerCard}>
          <LinkCard name="Alumnos" url="/Administrador/Alumnos" icon="bi bi-mortarboard" />
          <LinkCard name="Grupos" url="/Administrador/Grupos" icon="bi bi-people-fill" />
          <LinkCard name="Empleados" url="/Administrador/Profesores" icon="bi bi-easel2-fill" />
          {isSuperAdmin &&
            <LinkCard name="Adminis" url="/Administrador/Admins" icon="bi bi-person-gear" />
          }
        </div>
      </section>
      {children}
    </section>
  );
}
