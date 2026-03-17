# 🪐 RepoPulse

Welcome to **RepoPulse**, the definitive tool to turn your large, complex codebases into a beautiful, interactive, 3D universe. Built for the Hackathon, this Next.js app leverages WebGL, Tree-sitter, and Supabase to instantly give developers a birds-eye view of their architecture.

![RepoPulse 3D View](public/hero.png)

## 🚀 Live Demo
Access the live interactive visualization hosted on GitHub Pages:
**[https://arqamxjay.github.io/Repo-Pulse](https://arqamxjay.github.io/Repo-Pulse)**

---

## 🏆 Key Features

### 1. 3D Architectural Mapping
Unlike standard file explorers, RepoPulse parses code syntax directly to find dependencies—rendering files as glowing interactive nodes and their connections as neon links in an auto-rotating 3D galaxy.

### 2. Semantic Highlighting & Hover-Paths
Lose the "black box" codebase syndrome. Type the name of a file in the search bar or mouse over a node to instantly highlight it and illuminate its connected cluster—fading out unrelated code so you can focus on the path.

### 3. "Security Heatmap" Flagging
Click the neon "**ACTIVATE_SECURITY_HEATMAP**" button to pulse your graph. RepoPulse scans for heuristic patterns (like exposed API keys or unencrypted tokens) and turns those nodes highly visible, glowing red. Ideal for quick codebase audits.

### 4. Supabase + AST Ingestion Pipeline
Under the hood, RepoPulse includes a local ingest worker (`scripts/ingest.ts`) that runs globally over a Node.js `tree-sitter` AST pipeline to identify nodes and edges, piping the final structured data securely into Supabase collections.

---

## 🛠️ The Tech Stack

- **Frontend Environment**: Next.js (App Router), React 19.
- **3D Visualization**: `react-force-graph-3d`, Three.js.
- **Data Backend**: Supabase (PostgreSQL).
- **Styling**: Tailwind CSS (v4).
- **Deployment**: GitHub Pages via static export.
- **Local AST Parser**: `tree-sitter`, `fast-glob`, `tsx`.

---

## 💻 Local Setup & How to Run

1. **Clone & Install**
```bash
git clone https://github.com/arqamxjay/Repo-Pulse.git
cd Repo-Pulse
npm install --legacy-peer-deps
```

2. **Supply Supabase Environment**
Create `.env.local` and add your specific Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kkkuzumhnhuepmmpnggl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
Ensure your Supabase instance has the `nodes` and `edges` SQL tables implemented perfectly.

3. **Ingest your Project (Optional Data Sync)**
To parse your local machine's ts/tsx architecture into Supabase, run the Tree-sitter ingestion parser:
```bash
npx tsx scripts/ingest.ts
```

4. **Spin up the Server!**
Run the visualizer web app on localhost port 3000.
```bash
npm run dev
```

The app will now be running visibly at `http://localhost:3001` ✨

---

## 🎮 How to Use RepoPulse

### **Interactive 3D Navigation**
- **Mouse Controls**: 
  - **Left-click + Drag**: Rotate the 3D graph
  - **Right-click + Drag**: Pan the view
  - **Scroll**: Zoom in/out
  - **Click on Node**: Camera focuses and zooms to that node

### **Search Functionality**
Located in the top-right panel:
1. Type any filename or module name in the search box
2. Matching nodes will **glow brighter** in the graph
3. Connected links to highlighted nodes become **more visible**
4. All other nodes fade out for better focus

### **Security Heatmap Mode**
Click the **"ACTIVATE_SECURITY_HEATMAP"** button at the bottom:
- Nodes with potential security risks turn **red and pulse**
- The button changes to **"DISABLE_HEATMAP"** 
- Click again to return to normal view
- Security risks are marked based on heuristic patterns

### **Node Information Panel**
The right-side panel displays:
- **System Online** status
- **Total Nodes**: Number of files in your codebase
- **Total Edges**: Number of dependencies/connections
- **Security Warning**: Shows when heatmap detects risks

### **Auto-Rotation**
- The graph automatically rotates for a cinematic view
- Rotation pauses when you hover over a node
- Resumes when you move away

---

## 🚢 Deployment

Deploy your own version to GitHub Pages:

```bash
npm run deploy
```

This command will:
1. Build an optimized production version
2. Export static files to the `out` folder
3. Push to the `gh-pages` branch
4. Your site will be live at: `https://[username].github.io/Repo-Pulse`

---

*Built with ❤️ for GDG Live Project using GitHub Copilot*

