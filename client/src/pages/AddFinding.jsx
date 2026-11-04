import React from "react";

function AddFinding({ form, updateForm, addFinding, saving }) {
return ( <section id="add-finding" aria-labelledby="add-finding-heading"> <header className="section-heading"> <div> <h2 id="add-finding-heading">Add an Audit Finding</h2> <p>Record an accessibility issue and its recommended solution.</p> </div> </header>

  <form className="panel" onSubmit={addFinding}>
    <fieldset>
      <legend>Finding Information</legend>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="title">Finding Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={updateForm}
            required
            maxLength={150}
            placeholder="Example: Missing form label"
          />
        </div>

        <div className="field">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            name="severity"
            value={form.severity}
            onChange={updateForm}
            required
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={updateForm}
            required
            maxLength={2000}
            placeholder="Explain the accessibility issue."
          />
        </div>

        <div className="field full">
          <label htmlFor="page_url">Affected Page URL</label>
          <input
            id="page_url"
            name="page_url"
            type="url"
            value={form.page_url}
            onChange={updateForm}
            required
            placeholder="https://example.gov.in/page"
          />
        </div>

        <div className="field">
          <label htmlFor="evidence">Evidence</label>
          <textarea
            id="evidence"
            name="evidence"
            value={form.evidence}
            onChange={updateForm}
            required
            maxLength={2000}
            placeholder="Describe the observed behaviour or test result."
          />
        </div>

        <div className="field">
          <label htmlFor="recommendation">Recommendation</label>
          <textarea
            id="recommendation"
            name="recommendation"
            value={form.recommendation}
            onChange={updateForm}
            required
            maxLength={2000}
            placeholder="Describe how the issue should be fixed."
          />
        </div>
      </div>
    </fieldset>

    <button className="primary" type="submit" disabled={saving}>
      {saving ? "Saving..." : "Add Finding"}
    </button>
  </form>
</section>


);
}

export default AddFinding;
