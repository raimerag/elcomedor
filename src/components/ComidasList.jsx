import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, remove, set } from "firebase/database";
import { useAuth } from "../Context/AuthContext";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
const ComidasList = () => {
  const { isAdmin, user } = useAuth();
  const [comidas, setComidas] = useState([]);

  useEffect(() => {
    const comidasRef = ref(db, "comidas");

    // Escuchar los cambios en la base de datos
    const unsubscribe = onValue(comidasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertimos el objeto en un array de comidas
        const comidasArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setComidas(comidasArray);
      } else {
        setComidas([]);
      }
    });

    // Limpieza del listener
    return () => unsubscribe();
  }, []);
  const handleDelete = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres eliminar esta comida?"
    );
    if (!confirmacion) return;

    try {
      await remove(ref(db, `comidas/${id}`));
      alert("Comida eliminada");
    } catch (error) {
      console.error("Error al eliminar comida:", error.message);
    }
  };

  const handleReaction = async (comidaId, tipo) => {
    if (!user) {
      alert("Debes estar logueado para confirmar asistencia.");
      return;
    }

    const uid = user.uid;
    const nombreUsuario = user.displayName || "Usuario";

    const likesRef = ref(db, `comidas/${comidaId}/likes/${uid}`);
    const dislikesRef = ref(db, `comidas/${comidaId}/dislikes/${uid}`);

    try {
      if (tipo === "like") {
        // Eliminar dislike si existe
        await remove(dislikesRef);
        // Agregar like con nombre
        await set(likesRef, nombreUsuario);
        alert("like add");
      } else if (tipo === "dislike") {
        // Eliminar like si existe
        await remove(likesRef);
        // Agregar dislike con nombre
        await set(dislikesRef, nombreUsuario);
        alert("dislike add");
      }
    } catch (error) {
      console.error("Error al actualizar reacción:", error);
      alert("Error al actualizar confirmación" + error.message);
    }
  };

  return (
    <>
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Comidas </h2>

        {comidas.length > 0 ? (
          <div className="flex gap-2 flex-wrap justify-center">
            {comidas.map((comida) => (
              <>
                <section className="p-2" key={comida.id}>
                  <div className="w-[220px] bg-indigo-100 text-indigo-800 p-2 rounded-md ">
                    {isAdmin && (
                      <div>
                        <button
                          onClick={() => handleDelete(comida.id)}
                          className="cursor-pointer text-md font-semibold text-slate-600 hover:text-red-800"
                        >
                          x
                        </button>
                      </div>
                    )}
                    <div className="mt-[-8x]">
                      <p className="text-center text-sm">🍽️ {comida.nombre}</p>
                      <p className="text-center text-sm"> 📅 {comida.fecha}</p>
                    </div>

                    {/* seccion LIKES ABRE  */}

                    {user && (
                      <div className="flex gap-3 justify-center my-[10px]">
                        <button
                          onClick={() => handleReaction(comida.id, "like")}
                          className="hover:opacity-75 transition delay-150 duration-250 ease-in-out hover:scale-150 cursor-pointer text-sm"
                        >
                          <BiLike />
                        </button>
                        <button
                          onClick={() => handleReaction(comida.id, "dislike")}
                          className="hover:opacity-75 transition delay-150 duration-250 ease-in-out hover:scale-150 cursor-pointer text-sm"
                        >
                          <BiDislike />
                        </button>
                      </div>
                    )}
                    {/* SECCION LIKES CIERRE  */}
                  </div>
                  {/* SECCION AZUL CIERRE  */}

                  {/* seccion confirmaciones  ABRE*/}
                  {user && (
                    <div className="mt-4 w-full text-left text-sm">
                      <p className="font-semibold text-base">Confirman:</p>
                      <ul className="list-disc list-inside">
                        {comida.likes ? (
                          Object.values(comida.likes).map((nombre, i) => (
                            <li className="text-xs" key={i}>
                              {nombre}
                            </li>
                          ))
                        ) : (
                          <>
                            <p className="text-xs">Nadie a Confirmado</p>
                          </>
                        )}
                      </ul>

                      <p className="font-semibold mt-2 base">No Confirman:</p>
                      <ul className="list-disc list-inside">
                        {comida.dislikes ? (
                          Object.values(comida.dislikes).map((nombre, i) => (
                            <li className="text-xs" key={i}>
                              {nombre}
                            </li>
                          ))
                        ) : (
                          <p className="text-xs">Nadie a Rechadado</p>
                        )}
                      </ul>
                    </div>
                  )}
                </section>
                {/* seccion confirmaciones CIERRE */}
              </>
            ))}
          </div>
        ) : (
          <p className="text-center">No hay comidas registradas aún.</p>
        )}
      </div>
    </>
  );
};

export default ComidasList;
