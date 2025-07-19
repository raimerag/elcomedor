import ComidasList from "./ComidasList";
import { useAuth } from "../Context/AuthContext";
import Layout from "./Layout";
const Home = () => {
  const { user } = useAuth();
  return <>{user ? <ComidasList /> : <Layout />}</>;
};

export default Home;
