import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ConfirmDialog from "./components/ConfirmDialog";

import Dashboard from "./pages/Dashboard";
import AddFinding from "./pages/AddFinding";
import AuditFindings from "./pages/AuditFindings";

import "./App.css";

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

const [deleteId, setDeleteId] = useState(null);

async function loadFindings() {
setLoading(true);
setError("");

try {
  const response = await fetch(`${API_URL}/findings`);

  if (!response.ok) {
    throw new Error(
      `Could not load findings (HTTP ${response.status}).`
    );
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
progress: findings.filter(
(item) => item.status === "In Progress"
).length,
resolved: findings.filter(
(item) => item.status === "Resolved"
).length,
};
}, [findings]);

function updateForm(event) {
const { name, value } = event.target;


setForm((current) => ({
  ...current,
  [name]: value,
}));

}

async function addFinding(event) {
event.preventDefault();

setSaving(true);
setError("");
setSuccess("");

try {
  const response = await fetch(`${API_URL}/findings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to save this finding."
    );
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to update this finding."
    );
  }

  setSuccess("Finding status updated.");
  await loadFindings();
} catch (err) {
  setError(err.message);
}

}

async function removeFinding() {
if (deleteId === null) return;


setError("");
setSuccess("");

try {
  const response = await fetch(
    `${API_URL}/findings/${deleteId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to delete this finding."
    );
  }

  setSuccess("Finding deleted successfully.");
  setDeleteId(null);

  await loadFindings();
} catch (err) {
  setError(err.message);
  setDeleteId(null);
}


}

return ( <div className="app-shell"> <a className="skip-link" href="#main-content">
Skip to main content </a>


  <Header />

  <div className="dashboard-layout">
    <Sidebar />

    <main id="main-content" className="main-content" tabIndex="-1">
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