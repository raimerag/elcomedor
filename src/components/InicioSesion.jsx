import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../firebase";

const InicioSesion = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState();
  const [rol, setRol] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formValidation = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;
      const uid = user.uid;

      // Buscar el rol en la base de datos
      const rolRef = ref(db, `roles/${uid}`);
      const snapshot = await get(rolRef);

      if (snapshot.exists()) {
        const rolFromDB = snapshot.val();
        setRol(rolFromDB); // Guardamos el rol
      } else {
        setError("Rol no encontrado para este usuario.");
      }
    } catch (err) {
      console.error("Error de login:", err.message);
      setError("Credenciales inválidas o usuario no existe.");
    }
  };

  useEffect(() => {
    if (rol === "admin") {
      navigate("/foodregister");
    } else if (rol === "worker") {
      navigate("/");
    }
  }, [rol, navigate]);

  return (
    <>
      <div className="flex flex-col items-center mt-[150px] gap-6">
        {!rol && (
          <form
            className="w-[85%] sm:w-[400px] p-[20px] flex flex-col items-center border-2 border-indigo-600 rounded-lg"
            onSubmit={formValidation}
          >
            <h3 className="my-4 text-base/7 font-semibold text-gray-900">
              Iniciar Sesion
            </h3>

            <div className="">
              <label className="block text-sm/6 font-medium text-gray-900">
                Email:{" "}
              </label>
              <input
                className=" block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                type="email"
                name="email"
                placeholder="Correo"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Contraseña:{" "}
              </label>
              <input
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 px-3.5 py-2.5 text-white rounded-lg mt-4 hover:bg-indigo-500"
            >
              Entrar
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
      </div>
      <div className="mt-[100px] ml-[50px]">
        <Link
          to="/"
          className="cursor-pointer bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg"
        >
          Volver
        </Link>
      </div>
    </>
  );
};

export default InicioSesion;
