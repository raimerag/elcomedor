import About from "./components/About";
import InicioSesion from "./components/InicioSesion";
import FoodRegister from "./components/FoodRegister";
import Home from "./components/Home";
import RutaPrivada from "./components/RutaPrivada";
import RegistrarTrabajador from "./components/RegistrarTrabajador";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Header from "./components/Header";
function App() {
  const { isAdmin, user } = useAuth();
  return (
    <>
      <div className="flex justify-center">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<RegistrarTrabajador />} />

        <Route
          path="/foodregister"
          element={
            <RutaPrivada condition={isAdmin}>
              <FoodRegister />
            </RutaPrivada>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/iniciosesion"
          element={
            <RutaPrivada condition={!user}>
              <InicioSesion />
            </RutaPrivada>
          }
        />
      </Routes>
    </>
  );
}

export default App;
