# Assemble.OS 🚀

**Assemble.OS** is a high-performance, real-time developer command center designed for modern engineering teams. It combines mission-critical monitoring, collaborative task management, and deep AI integration into a single, immersive "Mission Control" interface.

## ✨ Key Features

### 🧠 Neural AI Core (Gemini 3 Flash)
*   **Sprint Insights**: Automated analysis of active Jira/Sprint tasks to identify bottlenecks and provide technical warnings.
*   **System Optimization**: Real-time telemetry analysis of CPU, RAM, and GPU loads with AI-generated performance suggestions.
*   **Intelligent Terminal**: A command-line interface that leverages LLMs to provide technical insights and confirmations.

### ⚡ Real-Time Collaboration
*   **WebSocket Synchronization**: Multi-user state management. Task updates, chat messages, and system events sync across all connected clients instantly.
*   **Optimistic UI**: Zero-latency interactions with background server reconciliation.

### 🖥️ Immersive UI/UX
*   **Technical Aesthetic**: A "Brutalist-Modern" design language using glassmorphism, scanline effects, and high-density data grids.
*   **Audit Terminal**: A live-streaming system log with syntax highlighting and interactive timestamps.
*   **Focus Mode**: A dedicated environment for deep work, enhancing visual contrast and reducing distractions.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS 4.0
*   **Animations**: Motion (Framer Motion)
*   **Icons**: Lucide React
*   **Backend**: Node.js, Express
*   **Real-Time**: WebSockets (ws)
*   **AI**: Google Gemini API (@google/genai)
*   **Build Tool**: Vite

* **Environment:** Developed for Google Developers Club/Gdg Live / GDG Technical Challenges & Assesments.
* **Core Focus:** Systems Architecture & Hardware-Software Convergence.
* **Status:** Legacy Archive (Migrated March 2026)
  
### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn
*   A Google Gemini API Key

## 📂 Project Structure

*   `/src/services/geminiService.ts` - AI logic and Gemini API integration.
*   `/server.ts` - Express server with WebSocket and Vite middleware.
*   `/src/App.tsx` - Main dashboard orchestration and UI logic.
*   `/src/index.css` - Global styles and Tailwind configuration.

## 📄 License

This project is licensed under the Apache-2.0 License.

---

Built by [Mohammad-Arqam-Javed/arqamxscales]
