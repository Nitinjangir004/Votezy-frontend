import { useEffect, useState } from "react";
import {
  getAllResults,
  getCandidates,
  getElections,
  declareResult,
} from "../api/votezyApi";

export default function Results() {
  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [electionName, setElectionName] = useState("");

  const [formMsg, setFormMsg] = useState({
    text: "",
    isError: false,
  });

  const [submitting, setSubmitting] = useState(false);

  async function loadResults() {
    setLoading(true);
    setLoadError("");

    try {
      const [resultsData, candidatesData, electionsData] =
        await Promise.all([
          getAllResults(),
          getCandidates(),
          getElections(),
        ]);

      console.log("Candidates:", candidatesData);

      setResults(resultsData);
      setCandidates(candidatesData);
      setElections(electionsData);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  }, []);

  async function handleDeclare() {
    if (!electionName) {
      setFormMsg({
        text: "Please select an election.",
        isError: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      await declareResult(electionName);

      setFormMsg({
        text: "Result declared successfully.",
        isError: false,
      });

      setElectionName("");

      loadResults();
    } catch (err) {
      setFormMsg({
        text: err.message,
        isError: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const candMap = {};

  candidates.forEach((c) => {
    candMap[c.id] = c;
  });

  return (
    <div className="container">
      <h2>Declare Election Result</h2>

      <div
        className="form-card"
        style={{ maxWidth: "600px" }}
      >
        <label>Select Election</label>

        <select
          value={electionName}
          onChange={(e) =>
            setElectionName(e.target.value)
          }
        >
          <option value="">
            Choose Election
          </option>

          {elections.map((election) => (
            <option
              key={election.id}
              value={election.electionName}
            >
              {election.electionName}
            </option>
          ))}
        </select>

        <button
          className="btn"
          onClick={handleDeclare}
          disabled={submitting}
        >
          {submitting
            ? "Declaring..."
            : "Declare Result"}
        </button>

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
      </div>

      <h3>Declared Results</h3>

      {loading && (
        <div className="muted">
          Loading...
        </div>
      )}

      {!loading && loadError && (
        <div className="muted">
          Error: {loadError}
        </div>
      )}

      {!loading &&
        !loadError &&
        results.length === 0 && (
          <div className="muted">
            No results declared yet.
          </div>
        )}

      {!loading &&
        !loadError &&
        results.map((r) => {
          const election = elections.find(
            (e) =>
              e.electionName === r.electionName
          );

          let electionCandidates = [];

          if (election) {
            electionCandidates = candidates.filter(
              (c) =>
                c.electionId === election.id ||
                c.election?.id === election.id
            );
          }

          const winner = candMap[r.winnerId];

          const maxVotes = Math.max(
            ...electionCandidates.map(
              (c) => c.voteCount || 0
            ),
            1
          );

          return (
            <div
              className="result-block"
              key={r.id}
            >
              <div className="result-winner">
                <strong>
                  {r.electionName}
                </strong>
                {" — "}
                Total Votes: {r.totalVotes}

                <br />

                Winner:{" "}
                <strong>
                  {winner
                    ? winner.name
                    : `Candidate #${r.winnerId}`}
                </strong>

                {winner
                  ? ` (${winner.party})`
                  : ""}
              </div>

              {electionCandidates.map((c) => (
                <div
                  className="vote-bar-row"
                  key={c.id}
                >
                  <div className="vote-bar-label">
                    <span>
                      {c.name} ({c.party})
                    </span>

                    <span>
                      {c.voteCount} votes
                    </span>
                  </div>

                  <div className="vote-bar-track">
                    <div
                      className="vote-bar-fill"
                      style={{
                        width: `${(
                          (c.voteCount || 0) /
                          maxVotes
                        ) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}
