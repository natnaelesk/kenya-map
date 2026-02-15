import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>
        Wajir <span>County</span> Tracker
      </h1>
      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/funds">Funds</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/governors">Governors</NavLink>
        <NavLink to="/mps">MPs</NavLink>
        <NavLink to="/mega-dams">Mega Dams</NavLink>
        <NavLink to="/map">Map</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
      </div>
    </nav>
  );
}
