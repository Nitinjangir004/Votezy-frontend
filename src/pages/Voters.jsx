import { useEffect, useState } from "react";
import { getVoters, registerVoter, updateVoter, deleteVoter } from "../api/votezyApi";

const emptyForm = { name: "", email: "" };

export default function Voters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formMsg, setFormMsg] = useState({ text: "", isError: false });
  const [submitting, setSubmitting] = useState(false);

  async function loadVoters() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getVoters();
      setVoters(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVoters();
  }, []);

  function startEdit(voter) {
    setEditId(voter.id);
    setForm({ name: voter.name, email: voter.email });
    setFormMsg({ text: "", isError: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setForm(emptyForm);
    setFormMsg({ text: "", isError: false });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormMsg({ text: "Please enter both name and email.", isError: true });
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await updateVoter(editId, form);
        setFormMsg({ text: "Voter updated successfully.", isError: false });
      } else {
        await registerVoter(form);
        setFormMsg({ text: "Voter registered successfully.", isError: false });
      }
      resetForm();
      loadVoters();
    } catch (err) {
      setFormMsg({ text: err.message, isError: true });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete voter #${id}?`)) return;
    try {
      await deleteVoter(id);
      loadVoters();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container">
      <h2>{editId ? `Edit Voter #${editId}` : "Register as a Voter"}</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Amit Kumar"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="e.g. amit.kumar@gmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving..." : editId ? "Save Changes" : "Register"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn"
            style={{ background: "#888", marginTop: "10px" }}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}

        {formMsg.text && (
          <div className={formMsg.isError ? "error-text" : "success-text"}>{formMsg.text}</div>
        )}
      </form>

      <h3>Registered Voters</h3>
      <table>
        <thead>
          <tr>
            <th>Voter ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="muted">
                Loading...
              </td>
            </tr>
          )}
          {!loading && loadError && (
            <tr>
              <td colSpan="5" className="muted">
                Error: {loadError}
              </td>
            </tr>
          )}
          {!loading && !loadError && voters.length === 0 && (
            <tr>
              <td colSpan="5" className="muted">
                No voters registered yet.
              </td>
            </tr>
          )}
          {!loading &&
            !loadError &&
            voters.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.hasVoted ? "Voted" : "Not Voted"}</td>
                <td>
                  <button className="btn btn-small btn-edit" onClick={() => startEdit(v)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-delete" onClick={() => handleDelete(v.id)}>
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
