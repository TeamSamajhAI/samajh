const BACKEND_URL = "http://172.16.23.210:5001";

export async function sendQuery(query, language = "en") {
  const res = await fetch(`${BACKEND_URL}/process-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, language }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.json();
}
