# LOGAN + Ollama Setup Guide 🐺

Run LOGAN with local AI models using Ollama - completely free and private!

## Quick Start

### 1. Install Ollama

**Windows:**
```powershell
winget install Ollama.Ollama
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull a Model

```bash
# Recommended for coding:
ollama pull qwen2.5-coder:7b      # 4.7GB - Fast, good for coding
ollama pull qwen2.5-coder:32b     # 19GB - Best for coding (needs 32GB RAM)
ollama pull codellama:13b         # 7.4GB - Code-focused
ollama pull deepseek-coder:6.7b   # 3.8GB - Efficient coding model

# General purpose:
ollama pull llama3.3              # Good all-around
ollama pull gemma3                # Google's model
ollama pull mistral               # Fast and capable
```

### 3. Start Ollama Server

```bash
ollama serve
```

(Keep this running in a terminal)

### 4. Configure LOGAN

Create `opencode.json` in your project folder:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "api": "http://localhost:11434/v1"
    }
  },
  "model": "ollama/qwen2.5-coder:7b"
}
```

### 5. Run LOGAN

```bash
logan
```

---

## Configuration Options

### Using Environment Variable (No Config File)

```bash
export OLLAMA_BASE_URL="http://localhost:11434"
logan --model ollama/qwen2.5-coder:7b
```

### Using Command Line

```bash
logan --model ollama/gemma3
```

### Multiple Models in Config

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "api": "http://localhost:11434/v1",
      "models": {
        "qwen2.5-coder:7b": {
          "name": "Qwen 2.5 Coder 7B"
        },
        "qwen2.5-coder:32b": {
          "name": "Qwen 2.5 Coder 32B"
        },
        "codellama:13b": {
          "name": "Code Llama 13B"
        }
      }
    }
  },
  "model": "ollama/qwen2.5-coder:7b"
}
```

---

## Recommended Models by Use Case

| Use Case | Model | Size | RAM Needed |
|----------|-------|------|------------|
| **Quick coding tasks** | `qwen2.5-coder:7b` | 4.7GB | 8GB |
| **Complex coding** | `qwen2.5-coder:32b` | 19GB | 32GB |
| **General assistant** | `llama3.3` | 4.7GB | 8GB |
| **Fast responses** | `gemma3` | 3.3GB | 8GB |
| **Code completion** | `codellama:7b` | 3.8GB | 8GB |

---

## Troubleshooting

### "Connection refused" Error
Make sure Ollama is running:
```bash
ollama serve
```

### Model Not Found
Pull the model first:
```bash
ollama pull <model-name>
```

### Slow Responses
- Use a smaller model (7B instead of 32B)
- Ensure you have enough RAM
- Check if GPU is being used: `ollama ps`

### Check Available Models
```bash
ollama list
```

---

## Tips

1. **Switch models on the fly**: Press `/model` in LOGAN to change models
2. **GPU acceleration**: Ollama automatically uses GPU if available
3. **Completely private**: All processing happens locally, no data leaves your machine

---

## Example Workflow

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Run LOGAN
cd ~/my-project
logan

# In LOGAN, just start chatting:
> "Add error handling to the login function"
```

---

Made with 🐺 by [Yuval Avidani](https://yuv.ai)
