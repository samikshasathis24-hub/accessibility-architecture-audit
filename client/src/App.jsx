import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ConfirmDialog from "./components/ConfirmDialog";

import Dashboard from "./pages/Dashboard";
import AddFinding from "./pages/AddFinding";
import AuditFindings from "./pages/AuditFindings";

import {
  getFindings,
  createFinding,
  updateFinding,
  deleteFinding,
} from "./api";

import "./App.css";

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

  const [deleteId, setDeleteId] = useState(null);

  // Load findings from API
  async function loadFindings() {
    setLoading(true);
    setError("");

    try {
      const data = await getFindings();
      setFindings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load findings when application starts
  useEffect(() => {
    loadFindings();
  }, []);

  // Calculate dashboard statistics
  const counts = useMemo(() => {
    return {
      total: findings.length,

      open: findings.filter(
        (item) => item.status === "Open"
      ).length,

      progress: findings.filter(
        (item) => item.status === "In Progress"
      ).length,

      resolved: findings.filter(
        (item) => item.status === "Resolved"
      ).length,
    };
  }, [findings]);

  // Update form fields
  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // Add a new finding
  async function addFinding(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createFinding(form);

      setForm(emptyForm);
      setSuccess("Finding added successfully.");

      await loadFindings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Update finding status
  async function changeStatus(id, status) {
    setError("");
    setSuccess("");

    try {
      await updateFinding(id, status);

      setSuccess("Finding status updated.");

      await loadFindings();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a finding
  async function removeFinding() {
    if (deleteId === null) return;

    setError("");
    setSuccess("");

    try {
      await deleteFinding(deleteId);

      setSuccess("Finding deleted successfully.");
      setDeleteId(null);

      await loadFindings();
    } catch (err) {
      setError(err.message);
      setDeleteId(null);
    }
  }

  return (
    <div className="app-shell">

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Header />

      <div className="dashboard-layout">

        <Sidebar />

        <main
          id="main-content"
          className="main-content"
          tabIndex="-1"
        >

          <section
            className="welcome-section"
            aria-labelledby="welcome-heading"
          >
            <h2 id="welcome-heading">
              Welcome to your Audit Workspace
            </h2>

            <p>
              Identify, document and resolve accessibility issues
              across digital services.
            </p>
          </section>

          <Dashboard counts={counts} />

          <AddFinding
            form={form}
            updateForm={updateForm}
            addFinding={addFinding}
            saving={saving}
          />

          <div
            className="alerts"
            aria-live="polite"
            aria-atomic="true"
          >
            {error && (
              <p className="alert error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="alert success" role="status">
                {success}
              </p>
            )}
          </div>

          <AuditFindings
            findings={findings}
            loading={loading}
            onChangeStatus={changeStatus}
            onDelete={setDeleteId}
            onRefresh={loadFindings}
          />

        </main>
      </div>

      <Footer />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete audit finding?"
        message="This action permanently removes the selected finding. Are you sure you want to continue?"
        onConfirm={removeFinding}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
}

export default App;