import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, set, push } from "firebase/database";

const FoodRegister = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState("");

  const infoValidator = () => {
    if (!nombre.trim() || !fecha.trim()) {
      setError("Debes completar todos los campos");
      return false;
    }
    setError("");
    return true;
  };

  const infoComida = async (e) => {
    e.preventDefault();

    if (!infoValidator()) return;

    // Creamos una nueva referencia con ID único
    const comidaRef = push(ref(db, "comidas"));

    const nuevaComida = {
      nombre,
      fecha,
      likes: [],
      dislikes: [],
    };
    console.log(nuevaComida);
    // Guardamos la comida
    await set(comidaRef, {
      nombre,
      fecha,
      likes: {},
      dislikes: {},
    });

    setInfo({ nombre, fecha });
    setNombre("");
    setFecha("");
    setError("");
  };

  const clearInfo = () => {
    setInfo({});
  };
  return (
    <>
      <div className="flex flex-col items-center mt-[150px] gap-6">
        <form
          className="w-[85%] sm:w-[400px] p-[20px] flex flex-col items-center border-2 border-indigo-600 rounded-lg"
          onSubmit={infoComida}
        >
          <h3 className="my-4 text-base/7 font-semibold text-gray-900">
            Agregar Comida
          </h3>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Comida:
            </label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="text"
              name="nombre"
              value={nombre}
              placeholder="Nombre de la comida"
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Fecha:
            </label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="date"
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="my-4 cursor-pointer bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg"
          >
            Agregar
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {info.nombre && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <p className="text-md font-semi-bold italic">
                Has agregado <strong>{info.nombre}</strong>
              </p>
              <button
                className="cursor-pointer text-md font-semibold text-slate-600 hover:text-red-800 px-3 py-1"
                onClick={clearInfo}
                type="button"
              >
                X
              </button>
            </div>
          )}
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

export default FoodRegister;
