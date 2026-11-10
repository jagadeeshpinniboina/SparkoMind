# 🌟 SparkoMind

> **Spark Your Mind. Shape Your Future.**  
> An Age-Adaptive, Generation-Aware Brain Training and Skill Development Platform catering to three demographics: **Kids (6–12)**, **Adults (13–59)**, and **Seniors (60+)**.

---

## 📖 Overview

SparkoMind is engineered with a **Zero-Trust Client Game Logic** architecture and an age-adaptive dynamic presentation system. The platform dynamically recalibrates UI density, sensory feedback, typography, cognitive pacing, and scoring incentives according to the user's demographic group:

- **Kids (6–12):** Playful aesthetics, high-saturation color palette, rounded surfaces, star-based milestones, and exploration incentives.
- **Adults (13–59):** Tech-minimalist slate and electric indigo styling, sharp focus, latency/reaction metrics, and analytical progress breakdowns.
- **Seniors (60+):** WCAG AAA high-contrast visibility, enlarged typography and touch targets, calm sage/navy accents, and cognitive preservation pacing with zero stress timers.

---

## 🏛️ System Architecture

SparkoMind adheres to a clean decoupled architecture:

```
SparkoMind/
├── backend/            # Express.js REST API (/api/v1) & Zero-Trust Validation Engine
├── frontend/           # React.js (Vite) Age-Adaptive SPA
├── docs/               # System architecture, schemas & threat models
├── .gitignore          # Git exclusion rules
└── README.md           # Developer onboarding & operational guide
```

### Core Architecture Principles:
1. **Zero-Trust Client Game Logic:** The frontend NEVER receives solution keys, validation formulas, or XP calculators. The backend (`backend/src/services/`) validates all moves and computes XP serverside.
2. **Age-Adaptive Themes:** Dynamic CSS variable switching based on demographic context (`data-demographic="kids|adults|seniors"`).
3. **Session Security:** JWT stored securely in `httpOnly`, `SameSite=Lax` cookies with bcrypt password hashing.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** >= 18.x (v20+ recommended)
- **npm** >= 9.x
- **MongoDB** >= 6.x (running locally on port `27017` or via MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# (Optional) Seed the database with cognitive games and challenges
npm run seed

# Start development server with auto-reload
npm run dev
```

The backend API will start on **`http://localhost:5000`**.  
Health check endpoint: **`http://localhost:5000/api/v1/health`**

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory in another terminal
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend client will start on **`http://localhost:5173`** (with automatic API proxy to `http://localhost:5000`).

---

### 3. Concurrent Local Execution (One-Liner)

To run both services side-by-side using npm scripts:

```bash
# Terminal 1 - Backend
cd D:\SparkoMind\backend && npm run dev

# Terminal 2 - Frontend
cd D:\SparkoMind\frontend && npm run dev
```

---

## 🧩 Cognitive Game Engines

The platform includes 5 modular cognitive game engines:
1. **GridMatrixEngine:** Spatial awareness & pattern recall.
2. **SequenceCodeEngine:** Working memory & algorithmic sequencing.
3. **CardMemoryEngine:** Visual associative recall & pairing.
4. **ChoiceLogicEngine:** Deductive reasoning & semantic decision-making.
5. **SpatialPathEngine:** Pathfinding & maze navigation constraints.

---

## 🔒 Security & Verification

- **Rate Limiting & Validation:** Inputs sanitized via `express-validator`.
- **CORS Configured:** Strict whitelist with credentials enabled.
- **Server Error Masking:** Production errors sanitized to prevent trace leakage.

---

## 📜 License
MIT © SparkoMind Team
