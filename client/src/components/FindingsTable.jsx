import React from "react";

function FindingsTable({ findings, onChangeStatus, onDelete }) {
  return (
    <div
      className="table-container"
      role="region"
      aria-label="Accessibility audit findings table"
      tabIndex="0"
    >
      <table>
        <caption>
          Accessibility audit findings and their current status
        </caption>

        <thead>
          <tr>
            <th scope="col">Finding</th>
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
            <th scope="col">Affected Page</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id}>
              <th scope="row">{finding.title}</th>

              <td>
                <span className={`severity-badge ${finding.severity?.toLowerCase()}`}>
                  {finding.severity}
                </span>
              </td>

              <td>
                <label
                  className="visually-hidden"
                  htmlFor={`status-${finding.id}`}
                >
                  Status for {finding.title}
                </label>

                <select
                  id={`status-${finding.id}`}
                  className="status-select"
                  value={finding.status}
                  onChange={(event) =>
                    onChangeStatus(finding.id, event.target.value)
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>

              <td>
                {finding.page_url ? (
                  <a href={finding.page_url}>
                    Visit affected page
                  </a>
                ) : (
                  <span>Not provided</span>
                )}
              </td>

              <td>
                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete finding ${finding.title}`}
                  onClick={() => onDelete(finding.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FindingsTable;