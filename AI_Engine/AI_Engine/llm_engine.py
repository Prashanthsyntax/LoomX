import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:latest"

def generate_response(prompt):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        print("STATUS:", response.status_code)
        print("RAW:", response.text)

        data = response.json()

        if "response" in data:
            return data["response"]
        else:
            return f"Ollama Error: {data}"

    except Exception as e:
        return f"System Error: {str(e)}"