import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const emptyForm = {
  title: "",
  description: "",
  severity: "Medium",
  page_url: "",
  evidence: "",
  recommendation: "",
};

function App() {
  const [findings, setFindings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadFindings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/findings`);
      if (!response.ok) {
        throw new Error(`Could not load findings (HTTP ${response.status}).`);
      }
      const data = await response.json();
      setFindings(data);
    } catch (err) {
      setError(
        `${err.message} Make sure the backend is running at ${API_URL}.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFindings();
  }, []);

  const counts = useMemo(() => {
    return {
      total: findings.length,
      open: findings.filter((item) => item.status === "Open").length,
      progress: findings.filter((item) => item.status === "In Progress").length,
      resolved: findings.filter((item) => item.status === "Resolved").length,
    };
  }, [findings]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function addFinding(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/findings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Unable to save this finding.");
      }

      setForm(emptyForm);
      setSuccess("Finding added successfully.");
      await loadFindings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id, status) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/findings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Unable to update this finding.");
      }

      setSuccess("Finding status updated.");
      await loadFindings();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeFinding(id) {
    const confirmed = window.confirm("Delete this audit finding?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/findings/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Unable to delete this finding.");
      }

      setSuccess("Finding deleted.");
      await loadFindings();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f6fa; color: #172033; font-family: Inter, Segoe UI, Arial, sans-serif; }
        button, input, textarea, select { font: inherit; }
        .app-shell { min-height: 100vh; }
        .topbar { background: #172554; color: white; padding: 22px max(24px, calc((100% - 1180px) / 2)); }
        .brand { font-size: 13px; letter-spacing: 1.8px; text-transform: uppercase; color: #bfdbfe; font-weight: 700; }
        .topbar h1 { margin: 8px 0 4px; font-size: clamp(24px, 4vw, 34px); }
        .topbar p { margin: 0; color: #dbeafe; font-size: 14px; }
        .container { max-width: 1180px; margin: 28px auto; padding: 0 22px 48px; }
        .section-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 26px 0 14px; }
        .section-heading h2 { margin: 0; font-size: 20px; }
        .muted { color: #64748b; font-size: 13px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .stat, .panel, .finding-card { background: white; border: 1px solid #e5eaf2; border-radius: 14px; box-shadow: 0 4px 16px rgba(15, 23, 42, .04); }
        .stat { padding: 18px; }
        .stat-label { color: #64748b; font-size: 13px; }
        .stat-number { margin-top: 8px; font-size: 28px; font-weight: 750; }
        .panel { padding: 22px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 7px; }
        .field.full { grid-column: 1 / -1; }
        label { font-size: 13px; font-weight: 650; color: #334155; }
        input, textarea, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 11px 12px; background: #fff; color: #172033; outline: none; }
        input:focus, textarea:focus, select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px #dbeafe; }
        textarea { min-height: 76px; resize: vertical; }
        .primary { border: 0; border-radius: 8px; background: #2563eb; color: white; padding: 11px 17px; font-weight: 650; cursor: pointer; }
        .primary:disabled { opacity: .6; cursor: wait; }
        .refresh { border: 1px solid #cbd5e1; border-radius: 8px; background: white; color: #334155; padding: 9px 13px; cursor: pointer; }
        .alerts { margin: 14px 0; }
        .alert { border-radius: 8px; padding: 11px 13px; margin-bottom: 8px; font-size: 14px; }
        .alert.error { color: #991b1b; background: #fee2e2; }
        .alert.success { color: #166534; background: #dcfce7; }
        .finding-list { display: grid; gap: 12px; }
        .finding-card { padding: 18px; }
        .finding-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }
        .finding-card h3 { margin: 0 0 7px; font-size: 17px; }
        .finding-card p { margin: 6px 0; color: #475569; font-size: 14px; line-height: 1.5; }
        .badge { display: inline-block; border-radius: 20px; padding: 5px 9px; font-size: 11px; font-weight: 750; white-space: nowrap; }
        .severity-Critical { background: #fee2e2; color: #991b1b; }
        .severity-High { background: #ffedd5; color: #9a3412; }
        .severity-Medium { background: #fef3c7; color: #92400e; }
        .severity-Low { background: #dcfce7; color: #166534; }
        .status-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 13px; }
        .status-row select { width: auto; min-width: 145px; padding: 7px 9px; font-size: 13px; }
        .delete { border: 0; background: transparent; color: #b91c1c; cursor: pointer; font-weight: 650; padding: 7px; }
        .empty { background: white; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 30px; text-align: center; color: #64748b; }
        @media (max-width: 700px) { .stats { grid-template-columns: repeat(2, 1fr); } .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: auto; } .finding-top { flex-direction: column; } }
      `}</style>

      <header className="topbar">
        <div className="brand">Accessibility • Quality • Inclusion</div>
        <h1>Accessibility Audit Dashboard</h1>
        <p>Record, track and resolve accessibility issues across public service websites.</p>
      </header>

      <main className="container">
        <section className="stats" aria-label="Finding summary">
          <div className="stat"><div className="stat-label">Total findings</div><div className="stat-number">{counts.total}</div></div>
          <div className="stat"><div className="stat-label">Open</div><div className="stat-number">{counts.open}</div></div>
          <div className="stat"><div className="stat-label">In progress</div><div className="stat-number">{counts.progress}</div></div>
          <div className="stat"><div className="stat-label">Resolved</div><div className="stat-number">{counts.resolved}</div></div>
        </section>

        <div className="section-heading">
          <div><h2>Add an audit finding</h2><div className="muted">Capture the issue and the recommended fix.</div></div>
        </div>

        <form className="panel" onSubmit={addFinding}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="title">Finding title *</label>
              <input id="title" name="title" value={form.title} onChange={updateForm} required placeholder="Example: Missing form label" />
            </div>
            <div className="field">
              <label htmlFor="severity">Severity *</label>
              <select id="severity" name="severity" value={form.severity} onChange={updateForm}>
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" value={form.description} onChange={updateForm} required placeholder="Explain what prevents users from accessing the page." />
            </div>
            <div className="field full">
              <label htmlFor="page_url">Page URL *</label>
              <input id="page_url" name="page_url" type="url" value={form.page_url} onChange={updateForm} required placeholder="https://example.gov.in/page" />
            </div>
            <div className="field">
              <label htmlFor="evidence">Evidence *</label>
              <textarea id="evidence" name="evidence" value={form.evidence} onChange={updateForm} required placeholder="Describe the test result or observed behaviour." />
            </div>
            <div className="field">
              <label htmlFor="recommendation">Recommendation *</label>
              <textarea id="recommendation" name="recommendation" value={form.recommendation} onChange={updateForm} required placeholder="Describe how the issue should be fixed." />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Add finding"}</button>
          </div>
        </form>

        <div className="alerts" aria-live="polite">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
        </div>

        <div className="section-heading">
          <div><h2>Audit findings</h2><div className="muted">Update the status as each issue is addressed.</div></div>
          <button className="refresh" type="button" onClick={loadFindings}>Refresh</button>
        </div>

        {loading ? (
          <div className="empty">Loading findings...</div>
        ) : findings.length === 0 ? (
          <div className="empty">No findings yet. Add your first audit finding using the form above.</div>
        ) : (
          <div className="finding-list">
            {findings.map((finding) => (
              <article className="finding-card" key={finding.id}>
                <div className="finding-top">
                  <div>
                    <h3>{finding.title}</h3>
                    <p>{finding.description}</p>
                  </div>
                  <span className={`badge severity-${finding.severity}`}>{finding.severity}</span>
                </div>
                <p><strong>Page:</strong> {finding.page_url}</p>
                <p><strong>Evidence:</strong> {finding.evidence}</p>
                <p><strong>Recommendation:</strong> {finding.recommendation}</p>
                <div className="status-row">
                  <label htmlFor={`status-${finding.id}`}>Status</label>
                  <select id={`status-${finding.id}`} value={finding.status} onChange={(event) => changeStatus(finding.id, event.target.value)}>
                    <option>Open</option><option>In Progress</option><option>Resolved</option>
                  </select>
                  <button className="delete" type="button" onClick={() => removeFinding(finding.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
