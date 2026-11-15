import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ConfirmDialog from "./components/ConfirmDialog";

import Dashboard from "./pages/Dashboard";
import AddFinding from "./pages/AddFinding";
import AuditFindings from "./pages/AuditFindings";
import Login from "./pages/Login";

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
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("accessaudit_user")) || null;
    } catch {
      return null;
    }
  });

  const [findings, setFindings] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  // Login
  function handleLogin(userData) {
    sessionStorage.setItem(
      "accessaudit_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem("accessaudit_user");

    setUser(null);
    setFindings([]);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  // Load findings
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

  useEffect(() => {
    if (user) {
      loadFindings();
    }
  }, [user]);

  // Dashboard statistics
  const counts = useMemo(() => ({
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
  }), [findings]);

  // Form updates
  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // Add finding
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

  // Update status
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

  // Delete finding
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

  // Show login page if user is not logged in
  if (!user) {
    return <Login onLogin={handleLogin} />;
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
            <div>
              <h2 id="welcome-heading">
                Welcome, {user.name}
              </h2>

              <p>
                Identify, document and resolve accessibility issues
                across digital services.
              </p>
            </div>

            <button
              type="button"
              className="refresh"
              onClick={handleLogout}
            >
              Logout
            </button>
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