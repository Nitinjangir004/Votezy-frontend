import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <h1>Votezy</h1>
        <nav>
          <NavLink to="/voters" className={({ isActive }) => (isActive ? "active" : "")}>
            Voters
          </NavLink>
          <NavLink to="/candidates" className={({ isActive }) => (isActive ? "active" : "")}>
            Candidates
          </NavLink>
          <NavLink to="/vote" className={({ isActive }) => (isActive ? "active" : "")}>
            Vote
          </NavLink>
          <NavLink to="/elections" className={({ isActive }) => isActive ? "active" : ""}
>          Elections
          </NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")}>
            Results
          </NavLink>
        </nav>
      </header>

      <Outlet />

      <footer>Votezy &mdash; Online Voting System</footer>
    </>
  );
}
