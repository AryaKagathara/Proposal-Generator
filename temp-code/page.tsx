"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Settings & Model configuration
  const [showSettings, setShowSettings] = useState(false);
  const [modelName, setModelName] = useState("gemini-4-carbon");
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [customModelName, setCustomModelName] = useState("");
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(0.95);
  const [maxOutputTokens, setMaxOutputTokens] = useState(2048);
  const [extraContext, setExtraContext] = useState("");

  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError("");
    setPart1("");
    setPart2("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          apiKey,
          modelName: useCustomModel ? customModelName : modelName,
          temperature,
          topP,
          maxOutputTokens,
          extraContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate proposal");
      }

      let p1 = data.part1 || "";
      let p2 = data.part2 || "";

      // Fallback in case split wasn't done on backend
      if (!p1 && !p2 && data.raw) {
        const separators = [
          "=== PART 2 ===",
          "=== Part 2 ===",
          "===PART 2===",
          "===PART2===",
          "PART 2:",
          "Part 2:",
          "PART 2\n",
          "Part 2\n",
          "PART 2",
          "Part 2"
        ];
        let foundSeparator = false;
        for (const sep of separators) {
          if (data.raw.includes(sep)) {
            const idx = data.raw.indexOf(sep);
            p1 = data.raw.substring(0, idx).trim();
            p2 = data.raw.substring(idx + sep.length).trim();
            foundSeparator = true;
            break;
          }
        }
        if (!foundSeparator) {
          if (data.raw.includes("Skip guesswork")) {
            const idx = data.raw.indexOf("Skip guesswork");
            p1 = data.raw.substring(0, idx).trim();
            p2 = data.raw.substring(idx).trim();
          } else {
            p1 = data.raw.trim();
            p2 = "";
          }
        }
      }

      setPart1(p1);
      setPart2(p2);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setToast(`Copied`);
    setTimeout(() => setToast(""), 3000);
  };



  return (
    <div className="container">
      {toast && <div className="toast">{toast}</div>}

      <header>
        <div className="brand">
          <span className="brand-logo">AI Proposal Generator</span>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="panel">
          <div className="panel-header-flex">
            <h2 className="panel-title">Job Details</h2>
            <button
              type="button"
              className="settings-toggle-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Gemini Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleGenerate} className="output-section">
            <div className="form-group">
              <label htmlFor="jd">Job Description</label>
              <textarea
                id="jd"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="extra-context">Extra Context / Custom Offers</label>
              <textarea
                id="extra-context"
                placeholder="Mention specific extra details you want to integrate naturally..."
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                style={{ minHeight: "200px" }}
              />
            </div>

            {showSettings && (
              <div className="settings-section">
                <label style={{ fontSize: "0.8rem", color: "var(--primary)" }}>Gemini API & Model Settings</label>

                <div className="form-group">
                  <label htmlFor="api-key">Gemini API Key</label>
                  <input
                    type="password"
                    id="api-key"
                    placeholder="Enter GEMINI_API_KEY"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="model">Gemini Model</label>
                    <select
                      id="model"
                      value={useCustomModel ? "custom" : modelName}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setUseCustomModel(true);
                        } else {
                          setUseCustomModel(false);
                          setModelName(e.target.value);
                        }
                      }}
                    >
                      <option value="gemini-4-carbon">Gemini 4 Carbon</option>
                      <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                      <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option>
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                      <option value="gemini-3.5-live-translate-preview">Gemini 3.5 Live Translate Preview</option>
                      <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                      <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      <option value="custom">Other (Type model name)...</option>
                    </select>
                  </div>

                  {useCustomModel && (
                    <div className="form-group">
                      <label htmlFor="custom-model">Custom Model Name</label>
                      <input
                        type="text"
                        id="custom-model"
                        placeholder="e.g. gemini-2.0-pro-exp"
                        value={customModelName}
                        onChange={(e) => setCustomModelName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="temp">Temperature ({temperature})</label>
                    <input
                      type="range"
                      id="temp"
                      min="0"
                      max="2.0"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="top-p">Top P ({topP})</label>
                    <input
                      type="range"
                      id="top-p"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="max-tokens">Max Output Tokens</label>
                  <input
                    type="number"
                    id="max-tokens"
                    min="1"
                    max="8192"
                    value={maxOutputTokens}
                    onChange={(e) => setMaxOutputTokens(parseInt(e.target.value) || 8192)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn" disabled={loading || !jobDescription.trim()}>
              {loading ? (
                <>
                  <div className="spinner" />
                  Generating Proposal...
                </>
              ) : (
                "Generate Proposal"
              )}
            </button>
          </form>
        </section>

        {/* Right Output Panel */}
        <section className="panel">
          <h2 className="panel-title">Generated Proposal</h2>

          {error && (
            <div style={{ padding: "1rem", backgroundColor: "var(--error-glow)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius-md)" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {!part1 && !part2 && !loading && !error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "var(--fg-tertiary)", textAlign: "center" }}>
              <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>⚡ Ready to Generate</p>
              <p style={{ fontSize: "0.85rem" }}>Input the job description on the left to generate a personalized proposal matching Arya's criteria.</p>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "var(--fg-secondary)" }}>
              <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px", marginBottom: "1rem", borderTopColor: "var(--primary)" }} />
              <p>Generating...</p>
            </div>
          )}

          {(part1 || part2) && (
            <div className="output-section">
              {/* Part 1 */}
              {part1 !== undefined && part1 !== null && (part1 || loading) && (
                <div className="proposal-box">
                  <div className="proposal-header">
                    <span className="proposal-title">Part 1: Work Description</span>
                    <button className="btn btn-secondary" onClick={() => copyToClipboard(part1, "Part 1")}>
                      Copy
                    </button>
                  </div>
                  <textarea
                    className="proposal-textarea"
                    value={part1}
                    onChange={(e) => setPart1(e.target.value)}
                    placeholder="Enter or modify Part 1..."
                  />
                  <div className="proposal-footer">
                    <span>Target: 500-800 chars</span>
                    <span>Actual: {part1.length} chars</span>
                  </div>
                </div>
              )}

              {/* Part 2 */}
              {part2 !== undefined && part2 !== null && (part2 || loading) && (
                <div className="proposal-box">
                  <div className="proposal-header">
                    <span className="proposal-title">Part 2: Personal Message</span>
                    <button className="btn btn-secondary" onClick={() => copyToClipboard(part2, "Part 2")}>
                      Copy
                    </button>
                  </div>
                  <textarea
                    className="proposal-textarea"
                    value={part2}
                    onChange={(e) => setPart2(e.target.value)}
                    placeholder="Enter or modify Part 2..."
                  />
                  <div className="proposal-footer">
                    <span>Target: 300-400 chars</span>
                    <span>Actual: {part2.length} chars</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
