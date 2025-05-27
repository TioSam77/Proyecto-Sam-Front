// hooks/useRoleRedirect.ts
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/clientApp";

export default function useRoleRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/Login", "/"];

    // No aplicar redirección si estás en una ruta pública
    if (publicRoutes.includes(pathname)) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/');
        return;
      }

      const docRef = doc(db, 'teacher', user.uid);
      const snap = await getDoc(docRef);

      let role = 'student';

      if (snap.exists()) {
        const r = snap.data().role;
        if (r === 1) role = 'superAdmin';
        else if (r === 2) role = 'admin';
        else if (r === 3) role = 'teacher';
      }

      // Redirección basada en rol, evita loops
      if (role === 'student' && !pathname.startsWith('/Alumno')) {
        router.replace('/Alumno');
      } else if (role === 'teacher' && !pathname.startsWith('/Profesor')) {
        router.replace('/Profesor');
      } else if ((role === 'admin' || role === 'superAdmin') && !pathname.startsWith('/Administrador')) {
        // Admin y superAdmin pueden quedarse
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);
}
