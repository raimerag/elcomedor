import { useState } from "react";
import { db, app } from "../firebase";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";

const RegistrarTrabajador = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const secondaryAuth = getAuth(app);
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );

      await updateProfile(cred.user, {
        displayName: nombre,
      });

      const uid = cred.user.uid;

      await set(ref(db, `usuarios/${uid}`), {
        nombre,
        email,
        rol: "worker",
      });

      await signOut(secondaryAuth);

      alert("Trabajador registrado");
      setNombre("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Error al registrar trabajador");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-[150px] gap-6">
        <form
          onSubmit={registrar}
          className="w-[85&] sm:w-[400px] p-[20px] flex flex-col items-center border-2 border-indigo-600 rounded-lg"
        >
          <h3 className="my-4 text-base/7 font-semibold text-gray-900">
            Registrar nuevo trabajador
          </h3>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Nombre :
            </label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="text"
              name="nombre"
              value={nombre}
              placeholder="Nombre"
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Correo :
            </label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="email"
              name="email"
              value={email}
              placeholder="correo@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Contraseña :
            </label>

            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 cursor-pointer bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg"
          >
            Registrar Trabajador
          </button>
        </form>
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

export default RegistrarTrabajador;
