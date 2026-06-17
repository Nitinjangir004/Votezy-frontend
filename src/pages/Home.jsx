import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <h2>Welcome to the Online Voting System</h2>
      <p>Make your voice heard in a secure and transparent way.</p>
      <Link to="/voters" className="btn">
        Register &amp; Vote
      </Link>
    </div>
  );
}
