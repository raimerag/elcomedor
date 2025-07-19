import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <h3 className="text-center">{register}</h3>

      <Link className="text-center" to="/" style={{ marginRight: 10 }}>
        Home
      </Link>
    </div>
  );
};

export default About;
