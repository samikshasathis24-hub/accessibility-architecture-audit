import React, { useMemo, useState } from "react";
import FindingsTable from "../components/FindingsTable";

function AuditFindings({
  findings,
  loading,
  onChangeStatus,
  onDelete,
  onRefresh,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Search, filter and sort findings dynamically
  const filteredFindings = useMemo(() => {
    let result = [...findings];

    // Search by title, description or page URL
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((item) =>
        [
          item.title,
          item.description,
          item.page_url,
        ].some((value) =>
          String(value || "").toLowerCase().includes(keyword)
        )
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter(
        (item) => item.status === statusFilter
      );
    }

    // Filter by severity
    if (severityFilter !== "All") {
      result = result.filter(
        (item) => item.severity === severityFilter
      );
    }

    // Sort findings
    if (sortBy === "title") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "severity") {
      const severityOrder = {
        Critical: 1,
        High: 2,
        Medium: 3,
        Low: 4,
      };

      result.sort(
        (a, b) =>
          (severityOrder[a.severity] || 99) -
          (severityOrder[b.severity] || 99)
      );
    } else if (sortBy === "newest") {
      result.reverse();
    }

    return result;
  }, [findings, search, statusFilter, severityFilter, sortBy]);

  return (
    <section
      id="audit-findings"
      aria-labelledby="findings-heading"
    >
      <header className="section-heading">
        <div>
          <h2 id="findings-heading">Audit Findings</h2>
          <p>
            Review and manage recorded accessibility issues.
          </p>
        </div>

        <button
          className="refresh"
          type="button"
          onClick={onRefresh}
        >
          Refresh Findings
        </button>
      </header>

      {/* Search and filter controls */}
      <div className="findings-toolbar">

        <div className="filter-control">
          <label htmlFor="finding-search">
            Search findings
          </label>

          <input
            id="finding-search"
            type="search"
            placeholder="Search by title, description or URL..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="status-filter">
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-control">
          <label htmlFor="severity-filter">
            Filter by severity
          </label>

          <select
            id="severity-filter"
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value)
            }
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-control">
          <label htmlFor="sort-findings">
            Sort findings
          </label>

          <select
            id="sort-findings"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Default order</option>
            <option value="title">Title (A–Z)</option>
            <option value="severity">Severity</option>
          </select>
        </div>

      </div>

      {/* Findings results */}
      {loading ? (
  <div
    className="loading-skeleton"
    role="status"
    aria-label="Loading audit findings"
  >
    <span className="visually-hidden">
      Loading audit findings...
    </span>

    {[1, 2, 3, 4].map((item) => (
      <div className="skeleton-row" key={item}>
        <span className="skeleton-block" />
        <span className="skeleton-block" />
        <span className="skeleton-block" />
      </div>
    ))}
  </div>
) : filteredFindings.length === 0 ? (
        <p className="empty">
          No matching audit findings found.
        </p>
      ) : (
        <>
          <p className="results-count" aria-live="polite">
            Showing {filteredFindings.length} of {findings.length} findings
          </p>

          <FindingsTable
            findings={filteredFindings}
            onChangeStatus={onChangeStatus}
            onDelete={onDelete}
          />
        </>
      )}
    </section>
  );
}

export default AuditFindings;