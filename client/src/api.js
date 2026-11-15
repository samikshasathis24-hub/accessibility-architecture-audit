const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const CACHE_KEY = "accessaudit_findings";

// Save findings in localStorage
function saveToCache(findings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(findings));
  } catch (error) {
    console.error("Cache saving failed:", error);
  }
}

// Get cached findings
function getFromCache() {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Reusable API request function
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.detail || `Request failed: ${response.status}`
    );
  }

  return result;
}

// GET all findings
export async function getFindings() {
  try {
    const findings = await apiRequest("/findings");

    if (!Array.isArray(findings)) {
      throw new Error("Invalid findings data.");
    }

    saveToCache(findings);
    return findings;
  } catch (error) {
    console.error("API request failed:", error);

    const cached = getFromCache();

    if (Array.isArray(cached)) {
      console.warn("Using cached findings.");
      return cached;
    }

    throw error;
  }
}

// POST new finding
export async function createFinding(form) {
  return apiRequest("/findings", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

// PUT update finding status
export async function updateFinding(id, status) {
  return apiRequest(`/findings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// DELETE finding
export async function deleteFinding(id) {
  return apiRequest(`/findings/${id}`, {
    method: "DELETE",
  });
}