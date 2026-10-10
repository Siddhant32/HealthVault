import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import Navbar from "../components/Navbar";
import api from "../api";

const ocrLanguages = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "mar", label: "Marathi" },
  { value: "guj", label: "Gujarati" },
  { value: "tam", label: "Tamil" },
  { value: "ben", label: "Bengali" },
];

export default function Records() {
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [form, setForm] = useState({ title: "", type: "other", doctorName: "", hospital: "", date: "", notes: "" });
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const [ocrText, setOcrText] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrBusy, setOcrBusy] = useState(false);
  const fileInput = useRef(null);

  const loadRecords = async () => {
    setRecordsLoading(true);
    setRecordsError("");
    try {
      const response = await api.get("/records");
      setRecords(response.data);
    } catch (error) {
      setRecordsError(
        error.response?.data?.message ||
          error.message ||
          "Could not load your records. Please try again."
      );
    } finally {
      setRecordsLoading(false);
    }
  };
  useEffect(() => { loadRecords(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/records", form);
      setForm({ title: "", type: "other", doctorName: "", hospital: "", date: "", notes: "" });
      await loadRecords();
    } catch (error) { window.alert(error.response?.data?.message || "Could not save this record. Please check your connection."); }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this medical record?")) return;
    try { await api.delete(`/records/${id}`); await loadRecords(); }
    catch { window.alert("Could not delete this record."); }
  };

  const runOcr = async () => {
    if (!ocrFile) { setOcrStatus("Choose a clear image of a medical document first."); return; }
    if (!ocrFile.type.startsWith("image/")) { setOcrStatus("Please upload an image (PNG, JPG or WEBP). Convert PDF pages to images first."); return; }
    setOcrBusy(true); setOcrStatus("Preparing text recognition…"); setOcrText(""); setOcrProgress(0);
    let worker;
    try {
      worker = await createWorker(ocrLanguage, 1, { logger: (message) => { if (message.status === "recognizing text") setOcrProgress(Math.round((message.progress || 0) * 100)); } });
      const result = await worker.recognize(ocrFile);
      const text = result.data.text.trim();
      setOcrText(text);
      setOcrStatus(text ? "Text extracted. Review it carefully before saving." : "No text found. Try a sharper, well-lit image.");
    } catch (error) {
      setOcrStatus("OCR could not read this image. Check your internet connection and try a clearer image.");
    } finally {
      if (worker) await worker.terminate();
      setOcrBusy(false);
    }
  };

  const useOcrText = () => {
    setForm((current) => ({ ...current, notes: current.notes ? `${current.notes}\n\n${ocrText}` : ocrText, title: current.title || (ocrFile?.name ? ocrFile.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") : "Scanned medical document") }));
    setOcrStatus("Extracted text added to the record form. Review it, then click Add Record.");
  };

  return <>
    <Navbar />
    <main className="page records-page">
      <div className="page-title"><p className="eyebrow">YOUR PRIVATE HEALTH LIBRARY</p><h1>Medical records<span className="title-period">.</span></h1><p>Keep reports, prescriptions and health history organized in one calm, secure space.</p></div>

      <section className="panel ocr-panel">
        <div className="ocr-heading"><div className="ocr-icon">▤</div><div><p className="eyebrow">SMART DOCUMENT SCANNER</p><h2>Extract text with OCR</h2><p>Turn a photo of a lab report or prescription into editable text. Recognition runs in your browser.</p></div><span className="ocr-pill">OCR · {ocrLanguage.toUpperCase()}</span></div>
        <div className="ocr-controls">
          <div className="ocr-upload-area" onClick={() => fileInput.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) { setOcrFile(file); setOcrStatus(""); } }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput.current?.click(); }}>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/bmp,image/tiff" hidden onChange={(e) => { setOcrFile(e.target.files?.[0] || null); setOcrStatus(""); }} />
            <span className="upload-symbol">↑</span><strong>{ocrFile ? ocrFile.name : "Choose a document image"}</strong><span>{ocrFile ? `${(ocrFile.size / 1024 / 1024).toFixed(2)} MB · Click to replace` : "PNG, JPG, WEBP · or drag and drop here"}</span>
          </div>
          <div className="ocr-settings"><label htmlFor="ocr-language">Document language</label><select id="ocr-language" value={ocrLanguage} onChange={(e) => setOcrLanguage(e.target.value)}>{ocrLanguages.map((lang) => <option key={lang.value} value={lang.value}>{lang.label}</option>)}</select><button className="primary-button full-width" type="button" onClick={runOcr} disabled={ocrBusy || !ocrFile}>{ocrBusy ? `Reading document… ${ocrProgress}%` : "Scan document →"}</button>{ocrBusy && <div className="ocr-progress"><span style={{ width: `${ocrProgress}%` }} /></div>}</div>
        </div>
        {ocrStatus && <p className="ocr-status" role="status">{ocrStatus}</p>}
        {ocrText && <div className="ocr-result"><div className="panel-heading"><h3>Extracted text</h3><span>{ocrText.length} characters</span></div><textarea aria-label="Extracted OCR text" value={ocrText} onChange={(e) => setOcrText(e.target.value)} /><div className="ocr-result-actions"><button type="button" className="secondary-button" onClick={() => navigator.clipboard?.writeText(ocrText)}>Copy text</button><button type="button" className="primary-button" onClick={useOcrText}>Use in record form ↓</button></div><small>OCR can misread names, dates, values and medicine dosages. Verify every detail against the original document before saving or acting on it.</small></div>}
      </section>

      <section className="panel record-form-panel"><div className="section-heading"><div><p className="eyebrow">ADD TO YOUR LIBRARY</p><h2>New medical record</h2></div><span className="section-count">01 / RECORD</span></div>
        <form onSubmit={submit}><div className="form-grid">
          <div><label htmlFor="record-title">Record title</label><input id="record-title" placeholder="e.g. Complete blood count" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label htmlFor="record-type">Document type</label><select id="record-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="other">Other</option><option value="lab_report">Lab Report</option><option value="prescription">Prescription</option><option value="diagnosis">Diagnosis</option><option value="vaccination">Vaccination</option><option value="scan">Scan</option><option value="discharge_summary">Discharge Summary</option></select></div>
          <div><label htmlFor="record-doctor">Doctor</label><input id="record-doctor" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} placeholder="Doctor's name (optional)" /></div>
          <div><label htmlFor="record-hospital">Hospital or clinic</label><input id="record-hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} placeholder="Facility name (optional)" /></div>
          <div><label htmlFor="record-date">Document date</label><input id="record-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <label htmlFor="record-notes">Notes / extracted text</label><textarea id="record-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add notes manually, or scan a document above and insert the extracted text…" />
        <div className="form-submit-row"><span>Review details before saving to your health history.</span><button className="primary-button">Add record <span aria-hidden="true">↗</span></button></div></form>
      </section>

      <section className="panel your-records-panel"><div className="section-heading"><div><p className="eyebrow">YOUR HISTORY</p><h2>Saved records</h2></div><span className="section-count">{records.length.toString().padStart(2, "0")} ITEMS</span></div>
        {recordsError && <p role="alert">{recordsError} <button type="button" className="secondary-button" onClick={loadRecords} disabled={recordsLoading}>Retry</button></p>}
        {recordsLoading ? <p role="status">Loading records...</p> : records.length === 0 ? <div className="empty-state"><span className="empty-icon">▤</span><strong>Your health library starts here</strong><p>Add a record or scan a document to get started.</p></div> : <div className="record-list">{records.map((record) => <div className="record-card" key={record._id}><div className="record-card-icon">▤</div><div className="record-card-content"><h3>{record.title}</h3><span className="tag">{String(record.type || "other").replace(/_/g, " ")}</span>{record.doctorName && <p>Doctor: {record.doctorName}</p>}{record.hospital && <p>Facility: {record.hospital}</p>}{record.date && <p>{new Date(record.date).toLocaleDateString()}</p>}{record.notes && <p className="record-notes-preview">{record.notes}</p>}</div><button className="danger-button" onClick={() => deleteRecord(record._id)}>Delete</button></div>)}</div>}
      </section>
    </main>
  </>;
}
