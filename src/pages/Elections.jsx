import { useEffect, useState } from "react";
import { getElections, createElection as apiCreateElection } from "../api/votezyApi";

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [electionName, setElectionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", isError: false });

  const loadElections = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getElections();
      setElections(data);
    } catch (err) {
      setLoadError(err.message || "Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!electionName.trim()) {
      setFormMsg({ text: "Please enter an election name.", isError: true });
      return;
    }
    setSubmitting(true);
    setFormMsg({ text: "", isError: false });
    try {
      await apiCreateElection(electionName.trim());
      setFormMsg({ text: "Election created successfully.", isError: false });
      setElectionName("");
      loadElections();
    } catch (err) {
      setFormMsg({ text: err.message || "Failed to create election.", isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Create Election</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="electionName">Election Name</label>
        <input
          id="electionName"
          type="text"
          placeholder="e.g. Lok Sabha 2026"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
        />

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Creating..." : "Create Election"}
        </button>

        {formMsg.text && (
          <div className={formMsg.isError ? "error-text" : "success-text"}>
            {formMsg.text}
          </div>
        )}
      </form>

      <h3>All Elections</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Election Name</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="2" className="muted">
                Loading...
              </td>
            </tr>
          )}
          {!loading && loadError && (
            <tr>
              <td colSpan="2" className="muted">
                Error: {loadError}
              </td>
            </tr>
          )}
          {!loading && !loadError && elections.length === 0 && (
            <tr>
              <td colSpan="2" className="muted">
                No elections registered yet.
              </td>
            </tr>
          )}
          {!loading &&
            !loadError &&
            elections.map((election) => (
              <tr key={election.id}>
                <td>{election.id}</td>
                <td>{election.electionName}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}