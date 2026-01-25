import { useState } from "react";

function App() {
 const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Backend Test Panel</h1>
      <input
  type="text"
  placeholder="Type something..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  style={{
    padding: "8px",
    width: "300px",
    display: "block",
    marginTop: "12px",
  }}
/>


      <button
  onClick={async () => {
    try {
      const res = await fetch("http://172.16.23.210:5001/process-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),

      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setResponse("FETCH FAILED — see console");
    }
  }}
  style={{ padding: "10px 16px", marginTop: "12px" }}
>
  Test Backend Connection
</button>


      <div style={{ marginTop: "20px" }}>
        <strong>Response:</strong>
        <div
          style={{
            marginTop: "8px",
            padding: "12px",
            border: "1px solid #ccc",
            minHeight: "40px",
          }}
        >
          {response}
        </div>
      </div>
    </div>
  );
}

export default App;
