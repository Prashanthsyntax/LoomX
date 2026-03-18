# LoomX - Generative Brain

![alt text](<AI.png>)

## Folder Structure

```bash
your-project/
├── AI_Engine/
│   ├── server.js       ← backend (copy from output)
│   └── package.json    ← (copy from output)
└── src/
    └── LoomXChat.jsx   ← React frontend (copy from output)
```

---

## Step 1 — Start Ollama

Make sure Ollama is running with llama3.2:

```bash
ollama serve
ollama pull llama3.2:latest   # if not already pulled
```

---

## Step 2 — Start AI_Engine backend

```bash
cd AI_Engine
npm install
npm start
# → Server running at http://localhost:3001
```

---

## Step 3 — Use LoomXChat.jsx in your React app

```bash
# In your React project (Vite, CRA, Next.js etc.)
# Copy LoomXChat.jsx to src/
# Then in App.jsx:
import LoomXChat from "./LoomXChat";
export default function App() { return <LoomXChat />; }
```

---

## API Endpoints (AI_Engine)

| Method | Path     | Description              |
|--------|----------|--------------------------|
| GET    | /health  | Check Ollama connection  |
| POST   | /chat    | Streaming SSE chat       |

### POST /chat body

```json
{
  "model": "llama3.2:latest",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

### SSE Stream response

```bash
data: {"token": "Hello", "done": false}
data: {"token": " there", "done": false}
data: {"token": "", "done": true}
```
