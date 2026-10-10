
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function DoctorView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get(`/share/view/${token}`)
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              "This link is invalid or expired."
          );
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (error) {
    return (
      <main className="doctor-page doctor-error">
        <div className="doctor-error-card">
          <div className="doctor-logo">HealthVault</div>
          <div className="error-icon">!</div>
          <h1>Access unavailable</h1>
          <p>{error}</p>
          <p>
            Ask the person who shared this link to generate
            a valid link if access is still required.
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="doctor-page loading-page">
        <div className="loading-card">
          <div className="doctor-logo">HealthVault</div>
          <p>Loading patient information...</p>
        </div>
      </main>
    );
  }

  const { user, profile = {}, records = [] } = data;

  const showValue = (value) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not provided";

  const sections = [
    {
      title: "Allergies",
      items: profile.allergies || [],
      empty: "No allergies listed.",
      render: (item) => (
        <>
          <strong>{showValue(item.name)}</strong>
          <p>Reaction: {showValue(item.reaction)}</p>
        </>
      ),
      danger: true,
    },
    {
      title: "Medications",
      items: (profile.medications || []).filter(
        (item) => item.active !== false
      ),
      empty: "No active medications listed.",
      render: (item) => (
        <>
          <strong>{showValue(item.name)}</strong>
          <p>Dosage: {showValue(item.dosage)}</p>
          <p>Frequency: {showValue(item.frequency)}</p>
        </>
      ),
    },
    {
      title: "Medical Conditions",
      items: profile.medicalConditions || [],
      empty: "No medical conditions listed.",
      render: (item) => (
        <>
          <strong>{showValue(item.name)}</strong>
          <p>Status: {showValue(item.status)}</p>
          {item.notes && <p>Notes: {item.notes}</p>}
        </>
      ),
    },
  ];

  return (
    <div className="doctor-page">
      <header className="doctor-header">
        <div>
          <div className="doctor-logo">HealthVault</div>
          <span>Secure Patient Health Summary</span>
        </div>

        <div className="readonly-badge">
          <span aria-hidden="true">🔒</span>
          READ-ONLY ACCESS
        </div>
      </header>

      <main
        className="doctor-content"
        aria-label="Read-only patient health summary"
      >
        <section className="patient-header">
          <div className="patient-avatar">
            {user?.name?.charAt(0).toUpperCase() || "P"}
          </div>

          <div>
            <p className="patient-eyebrow">PATIENT OVERVIEW</p>
            <h1>{showValue(user?.name)}</h1>
            <p>Health profile and medical history</p>
          </div>
        </section>

        <section className="doctor-stats">
          <div>
            <span>Blood Group</span>
            <strong>{showValue(profile.bloodGroup)}</strong>
          </div>

          <div>
            <span>Height</span>
            <strong>
              {profile.height?.value
                ? `${profile.height.value} cm`
                : "Not provided"}
            </strong>
          </div>

          <div>
            <span>Weight</span>
            <strong>
              {profile.weight?.value
                ? `${profile.weight.value} kg`
                : "Not provided"}
            </strong>
          </div>

          <div>
            <span>Medical Records</span>
            <strong>{records.length}</strong>
          </div>
        </section>

        {sections.map((section) => (
          <section
            key={section.title}
            className="doctor-section doctor-information-section"
          >
            <div className="doctor-section-heading">
              <h2>{section.title}</h2>
              <span>{section.items.length} listed</span>
            </div>

            {section.items.length ? (
              <div className="doctor-list">
                {section.items.map((item, index) => (
                  <article
                    key={item._id || `${section.title}-${index}`}
                    className={`doctor-item ${
                      section.danger ? "danger-item" : ""
                    }`}
                  >
                    {section.render(item)}
                  </article>
                ))}
              </div>
            ) : (
              <p className="doctor-empty">{section.empty}</p>
            )}
          </section>
        ))}

        <section className="doctor-section doctor-information-section">
          <div className="doctor-section-heading">
            <h2>Medical Records</h2>
            <span>{records.length} records</span>
          </div>

          {records.length ? (
            <div className="doctor-records">
              {records.map((record) => (
                <article
                  key={record._id}
                  className="doctor-record"
                >
                  <div className="record-heading">
                    <strong>{showValue(record.title)}</strong>
                    <span>{showValue(record.type)}</span>
                  </div>

                  <div className="record-details">
                    {record.doctorName && (
                      <p>Doctor: {record.doctorName}</p>
                    )}
                    {record.hospital && (
                      <p>Hospital: {record.hospital}</p>
                    )}
                    {record.date && (
                      <p>
                        Date:{" "}
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    )}
                    {record.notes && <p>{record.notes}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="doctor-empty">
              No medical records available.
            </p>
          )}
        </section>

        <footer className="doctor-footer">
          <span aria-hidden="true">🔒</span>
          This is a read-only view shared through HealthVault.
          Information shown depends on the data provided by the patient.
        </footer>
      </main>
    </div>
  );
}
