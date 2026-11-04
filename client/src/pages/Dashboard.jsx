import React from "react";

function Dashboard({ counts }) {
return ( <section id="dashboard" aria-labelledby="dashboard-heading"> <header className="section-heading"> <div> <h2 id="dashboard-heading">Dashboard Overview</h2> <p>Summary of accessibility audit findings.</p> </div> </header>

```
  <div className="stats-grid">
    <article className="stat-card">
      <h3>Total Findings</h3>
      <p>{counts.total}</p>
    </article>

    <article className="stat-card">
      <h3>Open</h3>
      <p>{counts.open}</p>
    </article>

    <article className="stat-card">
      <h3>In Progress</h3>
      <p>{counts.progress}</p>
    </article>

    <article className="stat-card">
      <h3>Resolved</h3>
      <p>{counts.resolved}</p>
    </article>
  </div>
</section>


);
}

export default Dashboard;
