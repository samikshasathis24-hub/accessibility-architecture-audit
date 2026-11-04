import React from "react";
import FindingsTable from "../components/FindingsTable";

function AuditFindings({
findings,
loading,
onChangeStatus,
onDelete,
onRefresh,
}) {
return ( <section id="audit-findings" aria-labelledby="findings-heading"> <header className="section-heading"> <div> <h2 id="findings-heading">Audit Findings</h2> <p>Review and manage recorded accessibility issues.</p> </div>


    <button className="refresh" type="button" onClick={onRefresh}>
      Refresh Findings
    </button>
  </header>

  {loading ? (
    <p role="status">Loading audit findings...</p>
  ) : findings.length === 0 ? (
    <p className="empty">No audit findings have been recorded.</p>
  ) : (
    <FindingsTable
      findings={findings}
      onChangeStatus={onChangeStatus}
      onDelete={onDelete}
    />
  )}
</section>


);
}

export default AuditFindings;
