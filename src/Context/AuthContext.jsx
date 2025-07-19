import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";

// contexto creado
export const AuthContext = createContext();

// hook personalizado para consumir
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar si el usuario se loguea o desloguea
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Guardamos el usuario en el estado

        // Buscar el rol del usuario en la base de datos
        const rolRef = ref(db, `roles/${firebaseUser.uid}`);
        const snapshot = await get(rolRef);

        if (snapshot.exists()) {
          setRol(snapshot.val()); // Guardamos el rol
        } else {
          setRol(null); // Si no hay rol registrado
        }
      } else {
        // Si el usuario se desloguea
        setUser(null);
        setRol(null);
      }

      setLoading(false); // Terminamos la carga inicial
    });

    return () => unsubscribe(); // Limpiamos el listener
  }, []);

  const stateGlobal = {
    user,
    rol,
    loading,

    isAdmin: rol === "admin",
    isWorker: rol === "worker",
  };
  return (
    <AuthContext.Provider value={stateGlobal}>{children}</AuthContext.Provider>
  );
};
