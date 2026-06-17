import { useEffect, useState } from "react";

export default function Elections() {

  const [elections, setElections] = useState([]);
  const [electionName, setElectionName] = useState("");

  const API_URL = "http://localhost:8080/api/elections";

  const loadElections = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setElections(data);
  };

  useEffect(() => {
    loadElections();
  }, []);

  const createElection = async () => {

    await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        electionName
      })
    });

    setElectionName("");
    loadElections();
  };

  return (
    <div className="container">

      <h2>Create Election</h2>

      <input
        type="text"
        placeholder="Election Name"
        value={electionName}
        onChange={(e) => setElectionName(e.target.value)}
      />

      <button onClick={createElection}>
        Create Election
      </button>

      <h2>All Elections</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Election Name</th>
          </tr>
        </thead>

        <tbody>
          {elections.map((election) => (
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