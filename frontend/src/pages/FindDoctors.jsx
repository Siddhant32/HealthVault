
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function FindDoctors() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchDoctors = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await api.get("/doctors", {
        params: {
          search,
          specialty,
        },
      });

      setDoctors(response.data.doctors || []);
    } catch (err) {
      setDoctors([]);
      setError(
        err.response?.data?.message ||
          "Could not load doctors. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="find-doctors-page">
        <header className="find-doctors-heading">
          <span className="doctors-eyebrow">
            YOUR HEALTH, YOUR CHOICE
          </span>

          <h1>Find the right doctor.</h1>

          <p>
            Search doctors by name, specialty, or location
            and book an appointment.
          </p>
        </header>

        <section className="doctor-search-panel">
          <form onSubmit={searchDoctors}>
            <label htmlFor="doctor-search">
              Doctor name or location
            </label>

            <input
              id="doctor-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Mumbai, Dr. Sharma"
            />

            <label htmlFor="doctor-specialty">
              Medical specialty
            </label>

            <select
              id="doctor-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="">All specialties</option>
              <option value="General Physician">
                General Physician
              </option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Psychiatrist">Psychiatrist</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search doctors"}
            </button>
          </form>
        </section>

        <section className="doctor-results">
          <div className="doctor-results-heading">
            <h2>Available doctors</h2>
            <span>{doctors.length} found</span>
          </div>

          {error && <p className="doctor-search-error">{error}</p>}

          {!searched && (
            <div className="doctor-search-empty">
              <h3>Start your search</h3>
              <p>
                Enter a city, doctor name, or specialty to
                find matching doctors.
              </p>
            </div>
          )}

          {searched && !loading && !error && doctors.length === 0 && (
            <div className="doctor-search-empty">
              <h3>No doctors found</h3>
              <p>Try a different name, location, or specialty.</p>
            </div>
          )}

          <div className="doctor-results-grid">
            {doctors.map((doctor) => (
              <article className="doctor-card" key={doctor._id}>
                <div className="doctor-card-top">
                  <div className="doctor-avatar">
                    {doctor.name?.charAt(0) || "D"}
                  </div>

                  <div>
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialty}</p>
                  </div>
                </div>

                <div className="doctor-card-details">
                  <p>
                    <strong>Clinic:</strong>{" "}
                    {doctor.clinicName || "Not provided"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {doctor.address || doctor.city || "Not provided"}
                  </p>

                  <p>
                    <strong>Experience:</strong>{" "}
                    {doctor.experienceYears ?? "—"} years
                  </p>

                  <p>
                    <strong>Consultation:</strong>{" "}
                    {doctor.consultationFee != null
                      ? `₹${doctor.consultationFee}`
                      : "Contact clinic"}
                  </p>
                </div>

                <Link
                  className="doctor-book-button"
                  to={`/appointments/book/${doctor._id}`}
                  state={{ doctor }}
                >
                  Book appointment
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
