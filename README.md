# Artha: The AI Money Mentor 🚀
### *India’s first context-aware, editorial-grade financial copilot.*

Artha is a premium financial advisory platform designed to move beyond static spreadsheets. It combines deep financial engineering with generative AI to provide hyper-personalized, number-backed guidance for your journey to Financial Independence and Early Retirement (FIRE).

---

## ✨ Key Features

### 1. **Contextual AI Chat (Artha)**
*   **Hyper-Personalized**: Unlike generic bots, Artha reads your exact financial profile (Income, Expenses, Savings, Age) to provide math-backed advice.
*   **Quick Actions**: One-tap prompts for common queries like "Can I retire early?" or "How to save tax?".
*   **Intelligent Fallback**: Seamlessly switches between local AI (**Ollama**) and Cloud AI (**OpenAI**) based on the environment.

### 2. **Reactive FIRE Planner**
*   **Real-time Calculations**: Watch your "Required Freedom Capital" and "Retirement Age" shift instantly as you adjust expenses or SIPs.
*   **Scenario Simulator**: A "What-If" lab where you can visualize how investing ₹5k more today can shave years off your working life.

### 3. **Couple's Money Planner (India First)**
*   **Joint Optimization**: The first tool of its kind in India to optimize HRA claims, NPS matching, and SIP splits across two partners simultaneously.
*   **Combined Net Worth**: A unified tracker for household wealth.

### 4. **Intelligence Engines**
*   **Next Best Action**: A prioritized, color-coded engine that tells you exactly what to do next (e.g., "Build emergency fund", "Stop overspending").
*   **Financial Health Score**: A dynamic scoring system (0-100) inspired by premium credit scoring models.
*   **Jargon-Free "Simple Mode"**: A global toggle that translates complex financial terms into plain English for non-experts.

### 5. **Premium Editorial UI**
*   **Authority & Calm**: Designed with a high-contrast, minimalist "Editorial Authority" system (#002753).
*   **Downloadable Reports**: One-click "Download Plan" feature to export your financial health and strategy to a branded PDF/Print view.

---

## 🛠️ Tech Stack

**Frontend:**
*   Next.js 14 (App Router)
*   Tailwind CSS (Custom Editorial Design System)
*   Lucide React (Minimalist Iconography)
*   Recharts (Capital Velocity Projections)
*   Framer Motion (Micro-animations)

**Backend:**
*   FastAPI (Python)
*   SQLAlchemy & SQLite (Local-first persistence)
*   OpenAI / Ollama (Generative AI Bridge)

---

## 🚀 Installation & Setup

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv .venv && source .venv/bin/activate`.
3. Install dependencies: `pip install -r requirements.txt`.
4. (Optional) Add your `OPENAI_API_KEY` to an `.env` file for Cloud AI.
5. Launch the server: `uvicorn main:app --reload`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Add `NEXT_PUBLIC_API_URL=http://localhost:8000` to your `.env.local`.
4. Launch the app: `npm run dev`.

---

## 🏆 Hackathon Notes
**Problem Statement**: Most financial tools are "input-output" calculators that lack the human touch and proactive intelligence of an actual advisor.
**Solution**: Artha bridges the "Information Gap" by using AI that actually *knows* your data, wrapped in an interface that feels like reading a premium financial journal.

---

**Developed with ❤️ for the Hackathon.**
