
import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [showFix, setShowFix] = useState(false);

  const lineCount = input.split('\n').length;
  const charCount = input.length;

  const tryFix = (raw) => {
    let fixed = raw;
    fixed = fixed.replace(/'/g, '"');
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    fixed = fixed.replace(/,\s*(}|])/g, '$1');
    return fixed;
  };

  const handleFix = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
      setShowFix(false);
    } catch (e) {
      setError(e.message);
      setShowFix(true);
      setOutput('');
    }
  };

  const handleFixConfirm = () => {
    try {
      const fixed = tryFix(input);
      const parsed = JSON.parse(fixed);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('Fixed using auto-repair!');
      setShowFix(false);
    } catch (e) {
      setError("❌ Still couldn't fix: " + e.message);
      setOutput('');
    }
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setInput(reader.result);
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fixed.json';
    link.click();
  };

  return (
    <div className="app">
      <h1>Smart JSON Fixer & Beautifier</h1>
      <textarea
        className="json-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type JSON here..."
      ></textarea>

      <div className="info">Lines: {lineCount} | Characters: {charCount}</div>

      <input type="file" accept=".json" onChange={handleFileUpload} />

      <div className="button-group">
        <button onClick={handleFix}>Fix & Beautify</button>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {showFix && <button onClick={handleFixConfirm}>Should I fix it?</button>}

      {output && (
        <pre className="json-output">
          {output.split('\n').map((line, i) => (
            <div key={i}><span className="line-number">{i + 1}</span> {line}</div>
          ))}
        </pre>
      )}

      <footer>made by Yami</footer>
    </div>
  );
}

export default App;
