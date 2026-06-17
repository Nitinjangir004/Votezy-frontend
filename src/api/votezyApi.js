const API_BASE = "https://votezy-backend-j0be.onrender.com/api";

export async function apiCall(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const msg =
      body && (body.message || body.error)
        ? body.message || body.error
        : typeof body === "string" && body
        ? body
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body;
}

// Voters
export const getVoters = () => apiCall("/voters");
export const registerVoter = (voter) =>
  apiCall("/voters/register", { method: "POST", body: JSON.stringify(voter) });
export const updateVoter = (id, voter) =>
  apiCall(`/voters/update/${id}`, { method: "PUT", body: JSON.stringify(voter) });
export const deleteVoter = (id) =>
  apiCall(`/voters/delete/${id}`, { method: "DELETE" });

// Candidates
export const getCandidates = () => apiCall("/candidate");
export const addCandidate = (candidate) =>
  apiCall("/candidate/add", { method: "POST", body: JSON.stringify(candidate) });
export const updateCandidate = (id, candidate) =>
  apiCall(`/candidate/update/${id}`, { method: "PUT", body: JSON.stringify(candidate) });
export const deleteCandidate = (id) =>
  apiCall(`/candidate/delete/${id}`, { method: "DELETE" });

// Votes
export const castVote = (
  voterId,
  candidateId,
  electionId
) =>
  apiCall("/votes/cast", {
    method: "POST",
    body: JSON.stringify({
      voterId: Number(voterId),
      candidateId: Number(candidateId),
      electionId: Number(electionId)
    }),
  });
export const getAllVotes = () => apiCall("/votes");

// Election Results
export const declareResult = (electionName) =>
  apiCall("/election-result/declare", {
    method: "POST",
    body: JSON.stringify({ electionName }),
  });
  export const getElections = () => apiCall("/elections");
export const getAllResults = () => apiCall("/election-result");
