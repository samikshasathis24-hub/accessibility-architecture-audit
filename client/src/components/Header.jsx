import React from "react";

function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          A
        </div>

        <div className="brand-info">
          <h1>AccessAudit</h1>
          <p>Accessibility Architecture Platform</p>
        </div>
      </div>

      <nav aria-label="Primary navigation">
        <ul className="header-nav">
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>

          <li>
            <a href="#add-finding">Add Finding</a>
          </li>

          <li>
            <a href="#audit-findings">Audit Findings</a>
          </li>
        </ul>
      </nav>

      <div className="header-status">
        <span className="status-indicator"></span>
        <span>System Active</span>
      </div>
    </header>
  );
}

export default Header;