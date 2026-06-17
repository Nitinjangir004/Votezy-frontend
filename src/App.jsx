import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Voters from "./pages/Voters";
import Candidates from "./pages/Candidates";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Elections from "./pages/Elections";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/voters" element={<Voters />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<Results />} />
          <Route path="/elections" element={<Elections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
