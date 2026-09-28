# QuantGuard // Quantum Digital Signature Defense Console
### Quantum-Inspired Threat Detection Dashboard for Teleportation-Based QDS Verification
**Smart India Hackathon Prototype**

![QuantGuard Architecture](https://img.shields.io/badge/Security-Information--Theoretic-06b6d4)
![Protocol](https://img.shields.io/badge/Protocol-Teleportation--QDS--Pauli--XYZ-10b981)
![Threshold](https://img.shields.io/badge/Threshold-5σ%20Calibrated%20(0.1120)-f59e0b)
![License](https://img.shields.io/badge/Defense-Restricted%20Clearance-ef4444)

---

## 1. Executive Summary & Problem Context

Classical asymmetric digital signature algorithms (RSA, DSA, ECDSA) rely on computational hardness assumptions (integer factorization and discrete logarithms) that are mathematically vulnerable to polynomial-time attacks on quantum computers using **Shor’s Algorithm**.

**QuantGuard** implements and monitors a **Teleportation-Based Quantum Digital Signature (QDS)** system. Instead of relying on computational hardness, QDS derives its security directly from the fundamental laws of quantum mechanics:
- **Quantum No-Cloning Theorem:** An adversary cannot duplicate an unknown quantum state without corrupting it.
- **Pauli Complementarity ($X, Y, Z$ Bases):** Measuring a quantum state in non-orthogonal bases irreversibly collapses the wave function, introducing detectable measurement errors ($QBER$).
- **Statistical 5σ Thresholding:** Legitimate teleportation channels exhibit low depolarizing noise ($\mu = 0.042$, $\sigma = 0.014$). Any eavesdropping or forgery forces the mismatch rate to $> 0.32$, decisively exceeding the calibrated 5-sigma decision boundary ($T = 0.1120$).

---

## 2. Quickstart & Run Instructions

QuantGuard is designed to start with one command for the backend and one command for the frontend.

### Prerequisites
- Python 3.10+ (Installed)
- Node.js 18+ and npm (Installed)

### Mode A: Unified Single-Port Production Service (FastAPI + Built React App on Port 8000)
Runs the entire frontend and backend from a single port with zero external reverse proxy needed:

**On Windows:**
```cmd
run_production.bat
```

**On Linux / macOS:**
```bash
chmod +x run_production.sh
./run_production.sh
```

**Manual One-Liner:**
```bash
cd frontend && npm run build && cd ../backend && uvicorn main:app --host 0.0.0.0 --port 8000
```
> Open your browser at **`http://localhost:8000`** (serves both React UI and `/api/*` endpoints).

---

### Mode B: Containerized Deployment (Docker & Docker Compose)
```bash
docker compose up --build
```
> QuantGuard will be packaged inside a lightweight multi-stage image (`node:20-alpine` + `python:3.11-slim`) listening on **`http://localhost:8000`**.

---

### Mode C: Development Mode (Hot Reloading)

**Terminal 1 (Backend API):**
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 (Vite Frontend):**
```bash
cd frontend
npm install
npm run dev
```
> Development UI opens at **`http://localhost:5173`** with automated proxying to the backend on `:8000`.

---

## 3. Operator Access Credentials

| Field | Value |
| :--- | :--- |
| **Production URL** | `http://localhost:8000` |
| **Development URL** | `http://localhost:5173` |
| **Username** | `admin` |
| **Password** | `QuantGuard@2026` |
| **Clearance Level** | Top-Secret-QDS-Level-5 (Chief Quantum Security Officer) |

*(A one-click "Autofill" button is provided on the login page for convenience during evaluation).*

---

## 4. Key System Features & Architecture

### A. Global Mode Toggle (`Demo Mode` vs `Live Upload`)
Visible in the persistent top bar across every screen:
- **`Demo Mode` (ON):** Executes deterministic simulation against preloaded scenarios (Legitimate, Forgery, Impersonation, Replay, Unauthorized) without requiring files.
- **`Live Upload` (OFF):** Allows operators to drag-and-drop real signature payloads (`.sig`, `.txt`, `.pdf`, `.bin`, `.json`), computes SHA-256 digests, benchmarks them against registered signatures in SQLite, and inspects real-time quantum tampering.

### B. Security Operations Center (SOC) Dashboard
1. **Top KPI Cards:** Total Verifications, Legitimate Signatures, Malicious Attempts, Threat Level (SAFE / SUSPICIOUS / CRITICAL).
2. **Real-time Threat Status Panel:** Dynamic color-coded threat alert with calibrated QBER bounds.
3. **Attack Detection Donut Chart:** Categorization of blocked threats (Signature Forgery, Impersonation, Replay, Unauthorized Verifier).
4. **Pauli Eigenstate Tomography:** Bar chart comparing baseline channel noise vs observed legitimate fidelity vs adversary disturbance across $X$ (Hadamard), $Y$ (Circular), and $Z$ (Computational) bases.
5. **Statistical Threshold Decision View:** Chronological scatter/line plot of verification trials with the 5σ reference line ($0.1120$).
6. **Live Telemetry Log Stream:** Real-time auto-updating verification ledger (every 5 seconds). Clicking any row opens the side drawer.

### C. Right-Side Slide-in Telemetry Drawer
Triggered instantly upon verification execution or clicking any log:
- File name, size, and SHA-256 hash (JetBrains Mono format with 1-click copy).
- Step-by-step verification pipeline telemetry:
  1. Cryptographic Hash Extraction
  2. Pauli Eigenstate Tomography ($128$ Qubits)
  3. Basis Alignment & Signer Proof
  4. Nonce & Teleportation State Freshness
  5. Statistical Threshold Decision
- Final Verdict (LEGITIMATE / MALICIOUS) with anomaly reason.
- Forgery probability gauge and detection latency ($< 35 \text{ ms}$).
- Basis outcome breakdown table ($X, Y, Z$).
- **Download Audit Report (JSON):** Exports an evidentiary verification certificate.

### D. Quantum Attack Detection Vectors

| Threat Vector | Adversary Action | Quantum Detection Mechanism |
| :--- | :--- | :--- |
| **Signature Forgery** | Attacker Eve forges signature without Alice's quantum states | Measurement in wrong Pauli bases triggers No-Cloning wave collapse; mismatch rate jumps to $> 32\%$ ($> 0.1120$ threshold). |
| **Signer Impersonation** | Mallory poses as Alice using corrupted public basis key | Systematic basis misalignment ($> 40\%$ error) detected during receiver decryption. |
| **Replay Attack** | Eve re-transmits an intercepted valid signature | Nonce collision detected against SQLite `used_nonces` temporal vault. |
| **Unauthorized Verifier** | Rogue gateway attempts state decryption | Terminal authorization check fails; clearance Level-5 policy violation flagged. |

---

## 5. Smart India Hackathon Presentation Demo Script

*Use this concise 3-minute walkthrough during jury presentation:*

1. **Login & Orientation (30s):**
   - Navigate to `http://localhost:5173`.
   - Point out the dark enterprise SOC design, 3D rotating quantum wireframe globe (built with Three.js), and cryptographic authentication.
   - Click **"Autofill"** and **"INITIALIZE QUANTUM SESSION"**.

2. **Dashboard Telemetry & Physics Explanation (60s):**
   - Highlight the **KPI Cards** and **Real-Time Threat Assessment**.
   - Explain the **Pauli Eigenstate Tomography** chart: *"Notice how under normal conditions in $X, Y, Z$ bases, channel noise stays around $4.2\%$. But when an attacker intercepts or forges the signature, quantum no-cloning collapses the states, pushing error rates above $30\%$, well past our calibrated 5σ threshold of $0.1120$."*
   - Point out the **Statistical Decision View** where malicious points are flagged above the amber threshold line.

3. **Live Attack Demonstration (60s):**
   - Click **"Verify Signature"** in the sidebar.
   - Select **"Adversarial Signature Forgery (Eve)"** from the scenario dropdown.
   - Click **"EXECUTE QUANTUM TELEPORTATION VERIFICATION"**.
   - Show the **Right-Side Slide-in Drawer**: point out the step progression, verdict (`MALICIOUS`), high mismatch rate, and click **"DOWNLOAD AUDIT REPORT (JSON)"**.
   - Switch the top bar toggle to **"Live Upload"**: show that operators can drag-and-drop actual files and test the **"REGISTER LEGITIMATE SIGNATURE"** option.

4. **Audit Trail & System Config (30s):**
   - Open **"Audit Logs"**: demonstrate real-time search, verdict filtering, and full incident traceability.
   - Open **"Registry & Config"**: show the 5σ mathematical model ($\mu = 0.042$, $\sigma = 0.014$, $T = 0.1120$) and registered defense contracts.

---

## 6. Project Directory Structure

```
SIH PROJECT/
├── backend/
│   ├── main.py             # FastAPI REST endpoints & CORS
│   ├── qds_engine.py       # Quantum Pauli tomography simulation & statistical thresholding
│   ├── database.py         # SQLite models, schema initialization, and connections
│   ├── auth.py             # RFC 7519 HS256 JWT auth & credential verification
│   ├── seed_data.py        # Seed dataset of registered signatures and historical logs
│   ├── requirements.txt    # Python dependencies
│   └── quantguard.db       # Persistent SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/     # TopBar, Sidebar, CyberBackground (Three.js), VerificationDrawer
│   │   ├── context/        # AuthContext (JWT session), ModeContext (Demo vs Live)
│   │   ├── pages/          # Dashboard, Verify, AttackAnalysis, Metrics, Logs, Settings, Login
│   │   ├── services/       # Typed REST API client
│   │   ├── types/          # Domain TypeScript interfaces
│   │   ├── App.tsx         # Router and layout orchestration
│   │   ├── main.tsx        # React root entry
│   │   └── index.css       # Tailwind CSS v4 design system
│   ├── package.json
│   └── vite.config.ts      # Vite bundler configuration with API proxy
├── sample_signatures/      # Sample test files for live drag-and-drop verification
└── README.md               # Technical documentation & presentation script
```

---
*Built for Smart India Hackathon 2026 // National Quantum Mission Track*
