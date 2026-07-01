# Graphite Industrial Intelligence: Project Submission Document

## 1. Executive Summary
**Graphite Industrial Intelligence** is a next-generation predictive maintenance and root-cause analysis platform built for critical industrial infrastructure. It solves a massive pain point in modern manufacturing and heavy industry: the disconnect between live hardware telemetry and unstructured, text-heavy OEM technical manuals. 

By unifying these two data sources using an interactive Knowledge Graph and a Retrieval-Augmented Generation (RAG) AI pipeline, Graphite allows operators to instantly trace hardware failures back to exact repair procedures, reducing downtime and saving millions in operational costs.

---

## 2. The Problem
In industrial environments (power plants, manufacturing floors, aviation), equipment inevitably fails or requires maintenance. Currently, operators face two disconnected silos:
1. **Telemetry & Alerts:** Sensors output error codes (e.g., "ERR_TEMP_HIGH") into a dashboard.
2. **Static Documentation:** The solutions to these errors are buried inside 1,000-page PDF manuals, Standard Operating Procedures (SOPs), and historical incident reports.

When a turbine overheats, an engineer must leave the monitoring dashboard, open a physical or digital manual, search for the error code, read the surrounding context, and determine the fix. This manual cross-referencing process results in extended Mean Time To Repair (MTTR) and costly unplanned downtime.

---

## 3. The Solution: Graphite
Graphite bridges this gap through a unified, AI-driven interface. The platform ingests both physical asset data and unstructured text documents, linking them together.

### Key Features
* **Digital Twin Asset Registry:** Tracks the live health status (Operational, Maintenance, Offline) and physical location of all factory assets.
* **Automated Document Ingestion:** Operators upload massive technical manuals. The backend instantly parses, chunks, and vectorizes the text for semantic search.
* **Interactive Knowledge Graph:** A visual, node-based interface that maps relationships between physical assets, error states, and the specific documents that contain the repair instructions.
* **AI Root Cause Analysis & Q&A:** When an anomaly occurs, operators click the node in the Knowledge Graph to run an AI-powered Root Cause Analysis. Alternatively, they can chat directly with the RAG pipeline in the Q&A module to ask, *"How do I recalibrate the temperature sensor on Turbine B?"* and receive a cited answer.

---

## 4. Technical Architecture
The platform is designed for speed, type-safety, and seamless AI integration.

### Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Framer Motion
* **Graph Visualization:** `@xyflow/react` (React Flow)
* **Backend:** Node.js, Express
* **API Layer:** tRPC (Ensures end-to-end type safety between client and server)
* **Database:** SQLite (via `better-sqlite3` and Drizzle ORM) for ultra-fast, local, schema-safe storage.
* **AI Engine:** Google Generative AI (Gemini) powers both the vector embeddings for document search and the LLM generation for Q&A and Root Cause extraction.

### Data Flow
1. **Ingestion:** A `.txt` or `.md` manual is uploaded. The Node.js backend chunks the text and uses Gemini to generate vector embeddings, storing them alongside the asset metadata in SQLite.
2. **Alert Trigger:** An asset's status changes to "Offline".
3. **Graph Mapping:** The frontend dynamically renders the Knowledge Graph, visually connecting the failing asset to its associated documentation nodes.
4. **Resolution:** The user queries the AI. The backend retrieves the most relevant chunks using cosine similarity (simulated/indexed), feeds them to the Gemini LLM as context, and streams the formatted resolution back to the UI.

---

## 5. Business Impact
* **Reduced Downtime:** Cuts the time spent searching for repair instructions from hours to seconds.
* **Knowledge Retention:** Captures institutional knowledge. When senior engineers retire, the AI retains the context of how specific machines are fixed.
* **Scalability:** The architecture is designed to handle thousands of assets and documents, scalable across multiple plant locations.

---

## 6. Project Links
* **Live Demo (Hugging Face):** [Insert your Hugging Face Space URL here]
* **GitHub Repository:** https://github.com/AK-2110/Graphite-Industrial-Intelligence
* **Demo Video:** [Insert Demo Video Link Here]
