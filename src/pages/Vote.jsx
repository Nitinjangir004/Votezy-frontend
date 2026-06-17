import { useEffect, useState } from "react";
import {
  getCandidates,
  getElections,
  castVote
} from "../api/votezyApi";


export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [voterId, setVoterId] = useState("");
  const [candidateId, setCandidateId] = useState(null);
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
      setCandidateId(null);

      loadCandidates();
    } catch (error) {
      setMessage(error.message);
    }
  }

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
          onChange={(e) =>
            setVoterId(e.target.value)
          }
          placeholder="Enter voter ID"
        />

       <label style={{ marginTop: "15px" }}>
  Select Election
</label>

<select
  value={electionId}
  onChange={(e) =>
    setElectionId(e.target.value)
  }
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

        <label style={{ marginTop: "20px" }}>
          Select Candidate
        </label>

        <div className="candidate-options">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`candidate-card ${
                candidateId === candidate.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setCandidateId(candidate.id)
              }
            >
              <div className="cname">
                {candidate.name}
              </div>

              <div className="cparty">
                {candidate.party}
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn"
          onClick={handleVote}
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