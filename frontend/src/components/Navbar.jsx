import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };
  const links = [{ to: "/dashboard", label: "Overview" }, { to: "/profile", label: "Health profile" }, { to: "/records", label: "Records + OCR" }, { to: "/copilot", label: "AI Copilot" }, { to: "/share", label: "Share access" } , { to: "/doctors",label: "Find Doctors"},];
  return <nav className="navbar app-navbar">
    <Link to="/dashboard" className="logo"><span className="brand-mark">H<span>+</span></span><span>HealthVault<small>PERSONAL HEALTH SPACE</small></span></Link>
    <div className="nav-links">{links.map((link) => <Link key={link.to} to={link.to} className={location.pathname === link.to ? "active" : ""}>{link.label}</Link>)}<button className="logout-button" onClick={logout}>Sign out ↗</button></div>
  </nav>;
}
