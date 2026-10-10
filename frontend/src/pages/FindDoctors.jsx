
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { DEMO_TOKEN, getDemoDoctors } from "../mockApi";

function distanceInKm(from, to) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = radians(to.latitude - from.latitude);
  const longitudeDifference = radians(to.longitude - from.longitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function DoctorCard({ doctor, distance }) {
  return (
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

        {distance != null && (
          <p>
            <strong>Approx. distance:</strong> {distance.toFixed(1)} km
          </p>
        )}

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
  );
}

export default function FindDoctors() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [nearbySearched, setNearbySearched] = useState(false);
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

  const findNearbyDoctors = () => {
    setNearbyError("");
    setNearbyDoctors([]);
    setNearbySearched(false);

    if (!navigator.geolocation) {
      setNearbyError("Location is not supported by this browser.");
      return;
    }

    if (localStorage.getItem("token") !== DEMO_TOKEN) {
      setNearbyError(
        "Nearby results currently use the demo clinic list. Sign in with the demo account to try this preview.",
      );
      return;
    }

    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const closestDoctors = getDemoDoctors()
          .map((doctor) => ({
            ...doctor,
            distance: distanceInKm(location, doctor),
          }))
          .sort((first, second) => first.distance - second.distance);

        setNearbyDoctors(closestDoctors);
        setNearbySearched(true);
        setNearbyLoading(false);
      },
      (error) => {
        setNearbyLoading(false);
        setNearbyError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Allow location access in your browser and try again."
            : error.code === error.TIMEOUT
              ? "Getting your location took too long. Please try again."
              : "Could not get your location. Check your browser settings and try again.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
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

        <section className="nearby-doctors-panel" aria-labelledby="nearby-doctors-title">
          <div className="nearby-doctors-heading">
            <div>
              <span className="doctors-eyebrow">LOCATION-BASED DEMO</span>
              <h2 id="nearby-doctors-title">Nearby doctors</h2>
              <p>
                Find the closest clinics in our sample list using your
                browser location.
              </p>
            </div>
            <button
              className="nearby-location-button"
              type="button"
              onClick={findNearbyDoctors}
              disabled={nearbyLoading}
            >
              {nearbyLoading ? "Finding nearby doctors..." : "Use my location"}
            </button>
          </div>

          <p className="nearby-doctors-note">
            Location is used only in this browser. Sample clinic coordinates
            are approximate city-area markers, not verified clinic locations.
            Distances are estimates; call a clinic to confirm its address and
            availability.
          </p>

          {nearbyError && (
            <p className="doctor-search-error" role="alert">
              {nearbyError}
            </p>
          )}

          {nearbySearched && (
            nearbyDoctors.length ? (
              <>
                <div className="doctor-results-heading">
                  <h3>Closest sample clinics</h3>
                  <span>{nearbyDoctors.length} found</span>
                </div>
                <div className="doctor-results-grid">
                  {nearbyDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      distance={doctor.distance}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="doctor-search-empty">
                No sample clinics are available.
              </p>
            )
          )}
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
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
