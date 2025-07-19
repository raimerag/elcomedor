import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { VscPersonAdd } from "react-icons/vsc";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";

const Header = () => {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres cerrar sesion?"
    );
    if (!confirmacion) return;

    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <div className="flex justify-around items-center my-[10px] w-[90%] ">
        <div>
          <Link to="/">
            <h2 className="text-base font-bold italic"> El Comedor</h2>
          </Link>
        </div>
        <div className="flex gap-6">
          {!user && (
            <>
              <Link to="/iniciosesion" className="">
                <button className="flex items-center cursor-pointer bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 rounded-lg">
                  Iniciar Sesion
                  <IoMdExit className="ml-1 text-base" />
                </button>
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/foodregister" className="flex justify-center">
                <button className="cursor-pointer flex items-center text-xs hover:bg-indigo-100 rounded-lg px-1 py-1">
                  <span className="hidden sm:block">Registar Comida</span>
                  <IoFastFoodOutline className="ml-1 text-base" />
                </button>
              </Link>

              <Link to="/registro" className="flex justify-center">
                <button className="flex items-center cursor-pointer text-xs hover:bg-indigo-100 rounded-lg px-1 py-1">
                  <span className="hidden sm:block">Registar Trabajador</span>
                  <VscPersonAdd className="ml-1 text-base" />
                </button>
              </Link>
            </>
          )}
          {user && (
            <button className="flex justify-center" onClick={handleLogout}>
              <button className="flex items-center cursor-pointer text-xs hover:bg-indigo-100 rounded-lg px-1 py-1">
                <span className="hidden sm:block">Cerrar Sesion</span>
                <IoExitOutline className="ml-1 text-base" />
              </button>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
