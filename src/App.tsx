import React, { useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleGroupTabs = () => {
    setStatus("loading");

    chrome.runtime.sendMessage({ action: "GROUP_TABS" }, (response) => {
      if (response?.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
        alert("Grouping failed: " + response?.error);
      }
    });
  };

  return (
    <div className={`container ${status}`}>
      <div className="glow-bg"></div>

      <header>
        <h1 className="logo">Gooofy</h1>
      </header>

      <main>
        {status === "idle" && (
          <button className="primary-btn" onClick={handleGroupTabs}>
            Organize with AI
          </button>
        )}

        {status === "loading" && (
          <div className="loading-state">
            <div className="shimmer-bar"></div>
            <p>Gemini is sorting your chaos...</p>
          </div>
        )}

        {status === "success" && (
          <div className="success-state fade-in">
            <div className="check-icon">✓</div>
            <h2>All Set!</h2>
            <p>Your tabs are neatly grouped.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
