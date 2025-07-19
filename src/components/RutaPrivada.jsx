import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RutaPrivada = ({ condition, redirectTo = "/", children }) => {
  const { loading } = useAuth();

  if (loading) return <div className="text-center mt-[100px]">Cargando..</div>;

  return condition ? children : <Navigate to={redirectTo} />;
};

export default RutaPrivada;
