# Graphite Industrial Intelligence

Graphite Industrial Intelligence is a state-of-the-art predictive maintenance and root-cause analysis platform designed for critical industrial infrastructure. It bridges the gap between raw hardware telemetry and unstructured technical documentation. 

Instead of operators having to cross-reference sensor alerts with 500-page OEM manuals, the platform ingests everything into a unified ecosystem. It uses AI to semantically search documents and visually map relationships in real-time.

## Key Features

1. **Asset Registry:** Manage the digital twins of your industrial equipment. View live health statuses and track maintenance requirements.
2. **Document Ingestion:** Upload technical manuals and standard operating procedures (SOPs). Files are instantly parsed, chunked, and vectorized for semantic search by the AI engine.
3. **Interactive Knowledge Graph:** Visually explore complex relationships between physical assets, detected anomalies, and technical documentation. Run AI Root Cause Analysis directly from the visual interface.
4. **AI Knowledge Q&A:** Chat directly with the Retrieval-Augmented Generation (RAG) pipeline to ask complex maintenance questions and get instant answers sourced and cited from your uploaded manuals.

## Technology Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Flow (`@xyflow/react`)
* **Backend:** Node.js, Express, tRPC (Type-safe APIs)
* **Database:** SQLite (better-sqlite3) for local fast storage
* **AI & Embeddings:** Google Generative AI (Gemini)

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* An active Google Gemini API Key. You must set this in your environment for the AI features (Q&A, Root Cause Analysis) to work.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AK-2110/Graphite-Industrial-Intelligence.git
   cd Graphite-Industrial-Intelligence
   ```

2. **Set up Environment Variables:**
   * Navigate to the `server` directory and create a `.env` file:
     ```bash
     cd server
     # Create .env and add your Gemini API Key
     # GEMINI_API_KEY=your_api_key_here
     ```

3. **Install Dependencies:**
   * Open two terminal windows.
   * **Terminal 1 (Backend):**
     ```bash
     cd server
     npm install
     ```
   * **Terminal 2 (Frontend):**
     ```bash
     cd client
     npm install
     ```

### Running the Application

1. **Start the Backend Server:**
   In Terminal 1 (inside the `server` directory), run:
   ```bash
   npm run dev
   ```
   *(Alternatively, if `npm run dev` is not configured, run `npx tsx src/index.ts`)*

2. **Start the Frontend Client:**
   In Terminal 2 (inside the `client` directory), run:
   ```bash
   npm run dev
   ```

3. **Open the Application:**
   Open your browser and navigate to `http://localhost:5173` to access the Graphite Industrial Intelligence dashboard.

## Usage Workflow
1. **Register Assets:** Start by adding your physical equipment in the Asset Registry.
2. **Ingest Docs:** Upload technical manuals via the Document Ingestion module.
3. **Detect Anomalies:** When an asset goes offline, open the Knowledge Graph to trace the failure.
4. **Query AI:** Click on failing nodes or use the Q&A bot to extract exact repair procedures from your documentation.
