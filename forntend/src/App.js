import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ResumeApp from "./pages/ResumeApp";
import MatchCandidates from "./pages/MatchCandidates";
import TranslateApp from "./pages/TranslateApp";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page stays full screen (no menu) */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages with nav bar */}
        <Route
          path="/docqa"
          element={
            <Layout>
              <ResumeApp />
            </Layout>
          }
        />
         <Route
          path="/cvscreen"
          element={
            <Layout>
              <MatchCandidates />
            </Layout>
          }
        />
        <Route
          path="/translate"
          element={
            <Layout>
              <TranslateApp />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
