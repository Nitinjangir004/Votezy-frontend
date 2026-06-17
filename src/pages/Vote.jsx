import { useEffect, useState } from "react";
import {
  getCandidates,
  getElections,
  castVote
} from "../api/votezyApi";


export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [voterId, setVoterId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [electionId, setElectionId] = useState("");
  const [message, setMessage] = useState("");
  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadCandidates();
    loadElections();
  }, []);

  async function loadCandidates() {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadElections() {
    try {
      const data = await getElections();
      setElections(data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleElectionChange = (e) => {
    setElectionId(e.target.value);
    setCandidateId("");
  };

  async function handleVote() {
    setMessage("");

    if (!voterId) {
      setMessage("Please enter Voter ID");
      return;
    }

    if (!electionId) {
      setMessage("Please select an election");
      return;
    }

    if (!candidateId) {
      setMessage("Please select a candidate");
      return;
    }

    try {
      const response = await castVote(
        voterId,
        candidateId,
        electionId
      );

      setMessage(
        response.message || "Vote cast successfully"
      );

      setVoterId("");
      setElectionId("");
      setCandidateId("");

      loadCandidates();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredCandidates = candidates.filter(
    (candidate) => candidate.election && String(candidate.election.id) === String(electionId)
  );

  return (
    <div className="container">
      <h2>Cast Your Vote</h2>

      <div
        className="form-card"
        style={{ maxWidth: "700px" }}
      >
        <label>Voter ID</label>
        <input
          type="number"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          placeholder="Enter voter ID"
        />

        <label style={{ marginTop: "15px" }}>
          Select Election
        </label>
        <select
          value={electionId}
          onChange={handleElectionChange}
        >
          <option value="">
            Choose Election
          </option>
          {elections.map((election) => (
            <option
              key={election.id}
              value={election.id}
            >
              {election.electionName}
            </option>
          ))}
        </select>

        <label style={{ marginTop: "15px" }}>
          Select Candidate
        </label>
        <select
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          disabled={!electionId}
        >
          <option value="">
            {electionId ? "Choose Candidate" : "First choose an election"}
          </option>
          {filteredCandidates.map((candidate) => (
            <option
              key={candidate.id}
              value={candidate.id}
            >
              {candidate.name} ({candidate.party})
            </option>
          ))}
        </select>

        <button
          className="btn"
          onClick={handleVote}
          style={{ marginTop: "25px" }}
        >
          Cast Vote
        </button>

        {message && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}