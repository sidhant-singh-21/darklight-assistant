import requests
import json

# Ollama API URL
OLLAMA_API_URL = "http://localhost:11434/api/generate"

# Function to run LLaMA model
def run_llama(prompt):
    payload = {
        "model": "llama2-uncensored",  # Change this if your model name is different
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(OLLAMA_API_URL, json=payload)

    if response.status_code == 200:
        data = response.json()
        print("LLaMA Response:", data.get("response", "No response"))
    else:
        print("Error:", response.status_code, response.text)

# Example prompt
run_llama("Give me tips on cricket?")