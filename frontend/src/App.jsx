import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [decision, setDecision] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setDecision(data.decision);
    setTasks(data.tasks);
    setInput("");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Todo AI Agent Demo</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
        />
        <button type="submit">Send</button>
      </form>
      {decision && <pre>{JSON.stringify(decision, null, 2)}</pre>}
      <h3>Current Tasks:</h3>
      <ul>
        {tasks.map((t, i) => (
          <li key={`${t}-${i}`}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
