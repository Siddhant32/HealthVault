
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function ShareHealth() {
  const [shareUrl, setShareUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);

    try {
      const response = await api.post("/share/create");
      setShareUrl(response.data.url);
      setExpiresAt(response.data.expiresAt);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not generate share link."
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy. Please copy the link manually.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="page share-health-page">
        <header className="page-title">
          <p className="eyebrow">SECURE SHARING</p>
          <h1>Share with your doctor</h1>
          <p>
            Give your doctor temporary, read-only access
            to your health information.
          </p>
        </header>

        <section
          className="share-panel share-health-panel"
          aria-label="Secure health sharing"
        >
          {!shareUrl ? (
            <div className="share-create">
              <div className="share-icon" aria-hidden="true">
                +
              </div>

              <h2>Create a secure share link</h2>

              <p>
                Your doctor can view your health profile
                and medical records without editing them.
              </p>

              <button
                type="button"
                className="primary-button share-generate-button"
                onClick={generateLink}
                disabled={loading}
              >
                {loading
                  ? "Generating link..."
                  : "Generate Link & QR Code"}
              </button>
            </div>
          ) : (
            <div className="share-created">
              <div className="qr-wrapper">
                <QRCodeCanvas
                  value={shareUrl}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#102a43"
                  level="H"
                />
              </div>

              <h2>Your doctor access is ready</h2>

              <p>
                Scan the QR code or copy the secure link below.
              </p>

              <div className="share-link">
                <input
                  type="text"
                  aria-label="Read-only share link"
                  readOnly
                  value={shareUrl}
                  onFocus={(event) => event.target.select()}
                />

                <button
                  type="button"
                  className="share-copy-button"
                  onClick={copy}
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>

              <p className="expiry">
                Expires at:{" "}
                {expiresAt
                  ? new Date(expiresAt).toLocaleString()
                  : "As configured by the server"}
              </p>

              <div className="warning-box">
                This link may expose private medical information.
                Share it only with the intended healthcare provider.
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShareUrl("");
                  setExpiresAt("");
                  setCopied(false);
                }}
              >
                Create another link
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
