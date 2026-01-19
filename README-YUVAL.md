# OpenCode - הסוכן הקוד הפתוח שעובד עם כל מודל שתרצו 🚀

<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo" width="300">
    </picture>
  </a>
</p>

> **TL;DR:** OpenCode הוא סוכן AI לכתיבת קוד שרץ בטרמינל - בדיוק כמו Claude Code, רק שהוא קוד פתוח לחלוטין ועובד עם כל ספק LLM שתרצו.

---

## מה זה בכלל? בואו נפרק את זה 🤔

מסתבר שהרבה מפתחים מחפשים כלי AI לקידוד שלא יהיה תלוי בספק יחיד. הריפו הזה פותר בדיוק את הבעיה הזו.

OpenCode is an open-source AI coding agent that runs directly in your terminal. Think of it as Claude Code or GitHub Copilot Chat, but with these key differences:

- **100% קוד פתוח** - תוכלו לקרוא כל שורת קוד
- **לא תלוי בספק אחד** - עובד עם Claude, OpenAI, Google, מודלים לוקאליים, ועוד
- **תמיכה מובנית ב-LSP** - מבין את הקוד שלכם ברמה עמוקה
- **ארכיטקטורת Client/Server** - אפשר להריץ על המחשב ולשלוט מרחוק מהטלפון!

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OpenCode Architecture                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐     ┌──────────────┐     ┌──────────────────────┐   │
│   │  אתם     │────▶│   OpenCode   │────▶│   LLM Provider       │   │
│   │ (Terminal)│     │   (Agent)    │     │   (Your Choice!)     │   │
│   └──────────┘     └──────────────┘     └──────────────────────┘   │
│                           │                        │               │
│                           │              ┌─────────┴────────┐      │
│                           ▼              │                  │      │
│                    ┌──────────────┐      ▼                  ▼      │
│                    │   הקוד שלכם   │   Claude           OpenAI     │
│                    │   (Local)    │   Anthropic         GPT-4     │
│                    └──────────────┘   Gemini            Local     │
│                                       Bedrock           Ollama    │
│                                       Copilot           LM Studio │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 בדיקת אבטחה - לאן נשלחים הפרומפטים שלכם?

שורה תחתונה אחרי שסרקתי את כל הקוד:

### ✅ מה כן נשלח (רק לספק שאתם בוחרים):
- **הפרומפטים שלכם** - נשלחים רק לספק ה-LLM שאתם מגדירים (Claude, OpenAI, וכו')

### ⚠️ שירותים אופציונליים (אפשר לכבות):
| שירות | כתובת | מה זה עושה | איך לכבות |
|--------|-------|-----------|-----------|
| Share | `api.opencode.ai` | שיתוף סשנים | `OPENCODE_DISABLE_SHARE=true` |
| Web Search | `mcp.exa.ai` | חיפוש באינטרנט | מבקש אישור לפני כל שאילתה |
| Code Search | `mcp.exa.ai` | חיפוש קוד/דוקומנטציה | מבקש אישור לפני כל שאילתה |

### ✅ מה לא נשלח:
- **אין טלמטריה** - OpenTelemetry הוא opt-in בלבד
- **אין tracking** - לא נשלח שום מידע לספק צד שלישי ללא הסכמה מפורשת

---

## 🚀 התקנה - 3 דקות ואתם באוויר

### הדרך המהירה (YOLO Mode 😎):
```bash
curl -fsSL https://opencode.ai/install | bash
```

### או דרך Package Manager:
```bash
# npm/bun/pnpm/yarn
npm i -g opencode-ai@latest

# Windows
scoop install opencode
choco install opencode

# macOS / Linux
brew install anomalyco/tap/opencode

# Arch Linux
paru -S opencode-bin

# Nix
nix run nixpkgs#opencode
```

---

## 🔧 הגדרת ספק LLM - Step by Step

### אפשרות 1: GitHub Copilot Subscription (מומלץ אם יש לכם!)

הקטע המדליק הוא שאם כבר יש לכם מנוי Copilot, אתם יכולים להשתמש בו בחינם!

```bash
# שלב 1: התחברות
opencode auth login github-copilot

# שלב 2: הגדרת המודל ב-opencode.json
```

צרו קובץ `opencode.json` בתיקיית הפרויקט:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "github-copilot": {}
  },
  "model": "github-copilot/gpt-4o"
}
```

**פלט לדוגמה:**
```
✓ Successfully authenticated with GitHub Copilot
✓ Available models: gpt-4o, gpt-4o-mini, claude-3.5-sonnet
```

---

### אפשרות 2: OpenAI (ChatGPT)

```bash
# שלב 1: הוספת API Key
opencode auth add openai
# יבקש מכם להדביק את ה-API Key מ-platform.openai.com
```

קובץ `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openai/gpt-4o"
}
```

או דרך Environment Variable:
```bash
export OPENAI_API_KEY="sk-..."
```

---

### אפשרות 3: Claude (Anthropic)

```bash
# שלב 1: הוספת API Key
opencode auth add anthropic
```

קובץ `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

או דרך Environment Variable:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

---

### אפשרות 4: מודלים לוקאליים (Ollama) 🏠

פסיכי - אפשר להריץ הכל לוקאלית בלי לשלוח שום דבר לענן!

```bash
# שלב 1: התקנת Ollama (אם עוד לא מותקן)
# Windows: winget install Ollama.Ollama
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# שלב 2: משיכת מודל
ollama pull qwen2.5-coder:32b
# או מודל קטן יותר: ollama pull qwen2.5-coder:7b

# שלב 3: הרצת Ollama
ollama serve
```

קובץ `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "api": "http://localhost:11434/v1",
      "models": {
        "qwen2.5-coder:32b": {
          "name": "Qwen 2.5 Coder 32B"
        }
      }
    }
  },
  "model": "ollama/qwen2.5-coder:32b"
}
```

---

### אפשרות 5: LM Studio 🖥️

אם אתם משתמשים ב-LM Studio:

```bash
# שלב 1: פתחו את LM Studio והפעילו את השרת
# בדרך כלל רץ על http://localhost:1234

# שלב 2: הגדירו את opencode.json
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lm-studio": {
      "api": "http://localhost:1234/v1",
      "models": {
        "local-model": {
          "name": "Your Local Model"
        }
      }
    }
  },
  "model": "lm-studio/local-model"
}
```

---

### אפשרות 6: Google Gemini

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your-key"
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "google/gemini-2.5-pro-preview"
}
```

---

### אפשרות 7: AWS Bedrock

```bash
# הגדרת AWS Credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0"
}
```

---

## 💻 שימוש בסיסי

```bash
# פתחו טרמינל בתיקיית הפרויקט והריצו:
opencode

# זהו! עכשיו אתם יכולים לשאול שאלות על הקוד שלכם
```

### פקודות שימושיות:
| פקודה | מה זה עושה |
|--------|-----------|
| `Tab` | מעבר בין סוכנים (build / plan) |
| `/help` | עזרה |
| `/clear` | ניקוי היסטוריה |
| `/model` | החלפת מודל |
| `Ctrl+C` | יציאה |

---

## 🎯 Use Cases - דוגמאות מעשיות

### Use Case 1: Debug באג מציק
```
אתם: "יש לי באג בקובץ auth.ts - המשתמשים לא מצליחים להתחבר אחרי refresh token"

OpenCode: *קורא את הקוד, מנתח את הבעיה*
"מצאתי את הבעיה! ב-auth.ts שורה 47, אתם מנסים לרענן את הטוקן אבל לא מחכים
לתשובה מהשרת. הנה התיקון..."
```

### Use Case 2: הוספת פיצ'ר חדש
```
אתם: "תוסיף dark mode לאפליקציה"

OpenCode: *סורק את הפרויקט*
"אני רואה שאתם משתמשים ב-Tailwind CSS. אני אצור context לניהול הtheme,
אוסיף toggle button, ואעדכן את ה-tailwind.config..."
*יוצר/עורך קבצים אוטומטית*
```

### Use Case 3: הבנת קוד קיים
```
אתם: "תסביר לי איך עובד ה-payment flow בפרויקט"

OpenCode: *קורא את הקבצים הרלוונטיים*
"הפיימנט פלואו עובד ככה:
1. המשתמש לוחץ על 'Pay' ב-checkout.tsx
2. נשלחת קריאה ל-/api/payment שב-payment.ts
3. שם מתבצעת אינטגרציה עם Stripe...
רוצים שאצור דיאגרמה?"
```

---

## 📊 דיאגרמת Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        OpenCode Workflow                          │
└──────────────────────────────────────────────────────────────────┘

     ┌─────────┐         ┌──────────┐         ┌──────────┐
     │  Input  │         │  Agent   │         │   LLM    │
     │  Prompt │────────▶│ Analysis │────────▶│ Provider │
     └─────────┘         └──────────┘         └──────────┘
                               │                    │
                               │                    │
                               ▼                    │
                         ┌──────────┐               │
                         │   LSP    │               │
                         │ Analysis │               │
                         │ (Code    │               │
                         │ Context) │               │
                         └──────────┘               │
                               │                    │
                               │                    │
                               ▼                    ▼
                         ┌──────────────────────────────┐
                         │      Response + Actions       │
                         │   (Read/Write/Execute/etc.)   │
                         └──────────────────────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────────┐
                         │        Your Codebase         │
                         │    (Files Modified/Created)   │
                         └──────────────────────────────┘
```

---

## 🔐 הגדרות אבטחה מומלצות

אם אתם רוצים שום קריאה לשרתים חיצוניים (חוץ מה-LLM שלכם):

```bash
# כבו את פיצ'ר השיתוף
export OPENCODE_DISABLE_SHARE=true
```

---

## 📚 Agents מובנים

OpenCode מגיע עם שני סוכנים שאפשר לעבור ביניהם עם `Tab`:

| Agent | תיאור | מתי להשתמש |
|-------|--------|-----------|
| **build** | גישה מלאה - קריאה, כתיבה, הרצת פקודות | פיתוח רגיל |
| **plan** | קריאה בלבד, מבקש אישור לפני פעולות | חקירת קוד, תכנון |

---

## 🆚 מה ההבדל מ-Claude Code?

| פיצ'ר | Claude Code | OpenCode |
|--------|-------------|----------|
| קוד פתוח | ❌ | ✅ 100% |
| בחירת ספק LLM | ❌ (רק Claude) | ✅ כל ספק |
| מודלים לוקאליים | ❌ | ✅ Ollama, LM Studio |
| תמיכת LSP מובנית | ❌ | ✅ |
| Desktop App | ❌ | ✅ |
| מחיר | לפי שימוש Claude | לפי הספק שתבחרו |

---

## 🤝 תרומה לפרויקט

רוצים לתרום? מעולה!
קראו את [CONTRIBUTING.md](./CONTRIBUTING.md) לפני שפותחים PR.

---

## 📖 לינקים שימושיים

- 🌐 [אתר רשמי](https://opencode.ai)
- 📚 [דוקומנטציה](https://opencode.ai/docs)
- 💬 [Discord](https://discord.gg/opencode)
- 🐦 [X/Twitter](https://x.com/opencode)

---

## 🏷️ License

MIT - עשו מה שבא לכם!

---

<p align="center">
  <i>Curated by Yuval Avidani, AI Builder & Speaker, YUV.AI</i><br>
  <i>GitHub Star | AWS GenAI Superstar</i>
</p>
