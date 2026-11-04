import React from "react";

function Sidebar() {
return ( <aside className="sidebar" aria-label="Dashboard sidebar"> <div className="sidebar-heading"> <p className="sidebar-eyebrow">MAIN MENU</p> <h2>Workspace</h2> </div>

```
  <nav aria-label="Dashboard navigation">
    <ul className="sidebar-menu">
      <li>
        <a href="#dashboard" className="sidebar-link">
          <span className="sidebar-icon" aria-hidden="true">01</span>
          <span>Dashboard Overview</span>
        </a>
      </li>

      <li>
        <a href="#add-finding" className="sidebar-link">
          <span className="sidebar-icon" aria-hidden="true">02</span>
          <span>Create Finding</span>
        </a>
      </li>

      <li>
        <a href="#audit-findings" className="sidebar-link">
          <span className="sidebar-icon" aria-hidden="true">03</span>
          <span>Manage Findings</span>
        </a>
      </li>
    </ul>
  </nav>

  <div className="sidebar-bottom">
    <div className="sidebar-info">
      <span className="info-label">ACCESSIBILITY MATTERS</span>
      <h3>Building a more inclusive web.</h3>
      <p>
        Identify barriers, improve usability and create
        accessible digital experiences.
      </p>
    </div>

    <div className="sidebar-version">
      <span>AccessAudit</span>
      <span>Version 1.0</span>
    </div>
  </div>
</aside>

);
}

export default Sidebar;
