import { useEffect, useState } from "react";
import {
  getCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getElections,
} from "../api/votezyApi";

const emptyForm = {
  name: "",
  party: "",
  electionId: "",
};

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formMsg, setFormMsg] = useState({
    text: "",
    isError: false,
  });
  const [submitting, setSubmitting] = useState(false);

  async function loadCandidates() {
    setLoading(true);
    setLoadError("");

    try {
      const [candidatesData, electionsData] = await Promise.all([
        getCandidates(),
        getElections(),
      ]);
      setCandidates(candidatesData);
      setElections(electionsData);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadCandidates();
  }, []);

  function startEdit(candidate) {
    setEditId(candidate.id);

    setForm({
      name: candidate.name,
      party: candidate.party,
      electionId: candidate.election?.id || "",
    });

    setFormMsg({
      text: "",
      isError: false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditId(null);
    setForm(emptyForm);

    setFormMsg({
      text: "",
      isError: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.party.trim() ||
      !form.electionId
    ) {
      setFormMsg({
        text: "Please enter name, party and select an election.",
        isError: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        party: form.party,
        electionId: Number(form.electionId),
      };

      if (editId) {
        await updateCandidate(editId, payload);

        setFormMsg({
          text: "Candidate updated successfully.",
          isError: false,
        });
      } else {
        await addCandidate(payload);

        setFormMsg({
          text: "Candidate registered successfully.",
          isError: false,
        });
      }

      resetForm();
      loadCandidates();
    } catch (err) {
      setFormMsg({
        text: err.message,
        isError: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete candidate #${id}?`)) return;

    try {
      await deleteCandidate(id);
      loadCandidates();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container">
      <h2>
        {editId
          ? `Edit Candidate #${editId}`
          : "Register a Candidate"}
      </h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="cname">Candidate Name</label>

        <input
          id="cname"
          type="text"
          placeholder="e.g. Arvind Kejriwal"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <label htmlFor="cparty">Party</label>

        <input
          id="cparty"
          type="text"
          placeholder="e.g. AAP"
          value={form.party}
          onChange={(e) =>
            setForm({
              ...form,
              party: e.target.value,
            })
          }
        />

        <label htmlFor="electionId">
          Select Election
        </label>

        <select
          id="electionId"
          value={form.electionId}
          onChange={(e) =>
            setForm({
              ...form,
              electionId: e.target.value,
            })
          }
        >
          <option value="">Choose Election</option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.electionName} (ID: {election.id})
            </option>
          ))}
        </select>


        <button
          type="submit"
          className="btn"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : editId
            ? "Save Changes"
            : "Register"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn"
            style={{
              background: "#888",
              marginTop: "10px",
            }}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}

        {formMsg.text && (
          <div
            className={
              formMsg.isError
                ? "error-text"
                : "success-text"
            }
          >
            {formMsg.text}
          </div>
        )}
      </form>

      <h3>Registered Candidates</h3>

      <table>
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Name</th>
            <th>Party</th>
            <th>Election ID</th>
            <th>Votes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="muted">
                Loading...
              </td>
            </tr>
          )}

          {!loading && loadError && (
            <tr>
              <td colSpan="6" className="muted">
                Error: {loadError}
              </td>
            </tr>
          )}

          {!loading &&
            !loadError &&
            candidates.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No candidates registered yet.
                </td>
              </tr>
            )}

          {!loading &&
            !loadError &&
            candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.party}</td>
                <td>{c.election?.id}</td>
                <td>{c.voteCount}</td>

                <td>
                  <button
                    className="btn btn-small btn-edit"
                    onClick={() =>
                      startEdit(c)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-small btn-delete"
                    onClick={() =>
                      handleDelete(c.id)
                    }
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