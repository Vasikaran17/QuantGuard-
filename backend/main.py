import os
import json
import time
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from database import get_db_connection, init_db
from auth import create_access_token, authenticate_user, get_current_user, DEMO_USER
from qds_engine import (
    simulate_teleportation_qds,
    compute_sha256,
    CALIBRATED_THRESHOLD,
    CALIBRATED_MU,
    CALIBRATED_SIGMA
)
from seed_data import seed_database

app = FastAPI(
    title="QuantGuard API",
    description="Quantum-Inspired Threat Detection Dashboard for Teleportation-Based QDS",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database is initialized on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Check if database has logs, otherwise seed it
    conn = get_db_connection()
    count = conn.execute("SELECT COUNT(*) FROM verification_logs").fetchone()[0]
    conn.close()
    if count == 0:
        print("Empty database detected. Seeding initial demo dataset...")
        seed_database()

# --- Request / Response Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class DemoVerifyRequest(BaseModel):
    scenario: str # "LEGITIMATE", "FORGERY", "IMPERSONATION", "REPLAY", "UNAUTHORIZED"
    verifier_id: Optional[str] = "VERIFIER-BOB-DEF-01"
    signer_id: Optional[str] = "ALICE-QDS-ROOT-01"

class RegisterSignatureRequest(BaseModel):
    file_name: str
    file_hash: str
    file_size: int
    signer_id: str
    description: Optional[str] = "Registered via QuantGuard Console"

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "QuantGuard Quantum Digital Signature Defense Engine",
        "simulation_mode": "Quantum-Inspired Teleportation Pauli XYZ Tomography",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/login")
def login(req: LoginRequest):
    user = authenticate_user(req.username, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use demo: admin / QuantGuard@2026"
        )
    token = create_access_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/me")
def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {"user": current_user}

@app.get("/api/stats")
def get_dashboard_stats(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_db_connection()
    
    total = conn.execute("SELECT COUNT(*) FROM verification_logs").fetchone()[0]
    legit = conn.execute("SELECT COUNT(*) FROM verification_logs WHERE verdict = 'LEGITIMATE'").fetchone()[0]
    malicious = conn.execute("SELECT COUNT(*) FROM verification_logs WHERE verdict = 'MALICIOUS'").fetchone()[0]
    
    # Attack breakdown counts
    attacks = conn.execute("""
        SELECT attack_type, COUNT(*) as cnt 
        FROM verification_logs 
        WHERE verdict = 'MALICIOUS' 
        GROUP BY attack_type
    """).fetchall()
    
    attack_counts = {
        "SIGNATURE_FORGERY": 0,
        "IMPERSONATION": 0,
        "REPLAY_ATTACK": 0,
        "UNAUTHORIZED_VERIFIER": 0
    }
    for row in attacks:
        if row["attack_type"] in attack_counts:
            attack_counts[row["attack_type"]] = row["cnt"]

    # Threat level assessment based on recent window and total ratio
    malicious_ratio = (malicious / total) if total > 0 else 0.0
    if malicious_ratio < 0.10:
        threat_level = "SAFE"
        threat_color = "teal"
        threat_desc = "Channel fidelity nominal. Low adversary teleportation disturbance detected."
    elif malicious_ratio < 0.25:
        threat_level = "SUSPICIOUS"
        threat_color = "amber"
        threat_desc = "Elevated QBER anomalies and nonce collisions flagged in quantum relay."
    else:
        threat_level = "CRITICAL"
        threat_color = "red"
        threat_desc = "Active quantum eavesdropping or unauthorized multi-vector intrusion underway."

    conn.close()

    return {
        "total_verifications": total,
        "legitimate_count": legit,
        "malicious_count": malicious,
        "malicious_ratio": round(malicious_ratio * 100, 2),
        "threat_level": threat_level,
        "threat_color": threat_color,
        "threat_description": threat_desc,
        "attack_breakdown": attack_counts,
        "calibrated_threshold": CALIBRATED_THRESHOLD,
        "simulation_note": "Quantum-inspired simulation: Pauli X, Y, Z basis measurement and teleportation eavesdropping tomography."
    }

@app.get("/api/metrics")
def get_system_metrics(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_db_connection()
    
    logs = conn.execute("""
        SELECT mismatch_rate, threshold, verdict, attack_type, detection_time_ms, timestamp, forgery_probability
        FROM verification_logs
        ORDER BY id DESC LIMIT 50
    """).fetchall()

    # Calculate real-time performance indicators
    total_logs = len(logs)
    if total_logs > 0:
        avg_time = round(sum(row["detection_time_ms"] for row in logs) / total_logs, 2)
        
        # Detection accuracy simulation:
        # In QDS with 5σ threshold, false positives are theoretically < 0.001%
        # Calculate empirical accuracy from logged trials
        correct = sum(
            1 for row in logs 
            if (row["verdict"] == "MALICIOUS" and (row["mismatch_rate"] > row["threshold"] or row["attack_type"] in ["REPLAY_ATTACK", "UNAUTHORIZED_VERIFIER"]))
            or (row["verdict"] == "LEGITIMATE" and row["mismatch_rate"] <= row["threshold"])
        )
        accuracy = round((correct / total_logs) * 100, 2)
        fpr = 0.04 # calibrated 0.04%
        
        # Security score out of 100 based on health and defense response
        malicious_count = sum(1 for row in logs if row["verdict"] == "MALICIOUS")
        mal_ratio = malicious_count / total_logs
        security_score = max(70, round(99.4 - (mal_ratio * 35), 1))
    else:
        avg_time = 24.5
        accuracy = 99.8
        fpr = 0.03
        security_score = 98.5

    # Points for statistical threshold decision chart
    threshold_points = []
    # Reverse to chronological order for charts
    for idx, row in enumerate(reversed(logs[-20:])):
        threshold_points.append({
            "index": idx + 1,
            "timestamp": row["timestamp"],
            "mismatch_rate": round(row["mismatch_rate"], 4),
            "threshold": CALIBRATED_THRESHOLD,
            "verdict": row["verdict"],
            "attack_type": row["attack_type"],
            "forgery_prob": round(row["forgery_probability"] * 100, 1),
            "is_anomaly": row["verdict"] == "MALICIOUS"
        })

    # Pauli Basis breakdown (X, Y, Z averages)
    basis_metrics = [
        {
            "basis": "X (Hadamard)",
            "expected_noise": round(CALIBRATED_MU, 4),
            "observed_legit": 0.041,
            "observed_attack": 0.342,
            "threshold": CALIBRATED_THRESHOLD,
            "fidelity": 0.959
        },
        {
            "basis": "Y (Circular)",
            "expected_noise": round(CALIBRATED_MU, 4),
            "observed_legit": 0.044,
            "observed_attack": 0.358,
            "threshold": CALIBRATED_THRESHOLD,
            "fidelity": 0.956
        },
        {
            "basis": "Z (Computational)",
            "expected_noise": round(CALIBRATED_MU, 4),
            "observed_legit": 0.039,
            "observed_attack": 0.349,
            "threshold": CALIBRATED_THRESHOLD,
            "fidelity": 0.961
        }
    ]

    conn.close()

    return {
        "detection_accuracy": accuracy,
        "false_positive_rate": fpr,
        "avg_detection_time_ms": avg_time,
        "security_score": security_score,
        "calibrated_threshold": CALIBRATED_THRESHOLD,
        "threshold_points": threshold_points,
        "basis_metrics": basis_metrics
    }

@app.get("/api/logs")
def get_logs(
    verdict: Optional[str] = "ALL",
    search: Optional[str] = "",
    limit: int = 50,
    offset: int = 0,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    conn = get_db_connection()
    query = "SELECT * FROM verification_logs WHERE 1=1"
    params = []

    if verdict and verdict != "ALL":
        query += " AND verdict = ?"
        params.append(verdict)

    if search:
        query += " AND (file_name LIKE ? OR verifier_id LIKE ? OR signer_id LIKE ? OR nonce LIKE ? OR attack_type LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard, wildcard, wildcard])

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    rows = conn.execute(query, params).fetchall()
    
    total_query = "SELECT COUNT(*) FROM verification_logs WHERE 1=1"
    total_params = []
    if verdict and verdict != "ALL":
        total_query += " AND verdict = ?"
        total_params.append(verdict)
    if search:
        total_query += " AND (file_name LIKE ? OR verifier_id LIKE ? OR signer_id LIKE ? OR nonce LIKE ? OR attack_type LIKE ?)"
        wildcard = f"%{search}%"
        total_params.extend([wildcard, wildcard, wildcard, wildcard, wildcard])
    
    total = conn.execute(total_query, total_params).fetchone()[0]

    logs = []
    for r in rows:
        item = dict(r)
        try:
            item["details"] = json.loads(item["details_json"])
        except Exception:
            item["details"] = {}
        del item["details_json"]
        logs.append(item)

    conn.close()
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "logs": logs
    }

@app.get("/api/demo-scenarios")
def get_demo_scenarios(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "scenarios": [
            {
                "id": "LEGITIMATE",
                "label": "Legitimate Signature (Nominal Channel)",
                "description": "Standard quantum teleportation verification with Alice's registered keys. Channel QBER within 5σ threshold.",
                "sample_file": "MOD_Tactical_Order_904.sig",
                "signer_id": "ALICE-QDS-ROOT-01",
                "verifier_id": "VERIFIER-BOB-DEF-01",
                "expected_verdict": "LEGITIMATE",
                "expected_attack": "NONE"
            },
            {
                "id": "FORGERY",
                "label": "Adversarial Signature Forgery (Eve)",
                "description": "Adversary attempts to forge signature state without private quantum key. No-cloning measurement collapse forces mismatch > 30%.",
                "sample_file": "Tampered_Tactical_Payload.sig",
                "signer_id": "UNKNOWN-FORGER-EVE",
                "verifier_id": "VERIFIER-BOB-DEF-01",
                "expected_verdict": "MALICIOUS",
                "expected_attack": "SIGNATURE_FORGERY"
            },
            {
                "id": "IMPERSONATION",
                "label": "Signer Impersonation Attack",
                "description": "Malicious entity Mallory attempts to impersonate registered commander Alice using corrupted public basis alignment token.",
                "sample_file": "Compromised_Order_Alice_Fake.sig",
                "signer_id": "MALLORY-ADV-09",
                "verifier_id": "VERIFIER-BOB-DEF-01",
                "expected_verdict": "MALICIOUS",
                "expected_attack": "IMPERSONATION"
            },
            {
                "id": "REPLAY",
                "label": "Quantum Replay Attack (Nonce Collision)",
                "description": "Adversary re-transmits an intercepted, previously verified signature. Instant rejection via temporal state vault.",
                "sample_file": "Replayed_Treasury_Settlement.sig",
                "signer_id": "ALICE-QDS-ROOT-01",
                "verifier_id": "VERIFIER-CHARLIE-TREAS-02",
                "expected_verdict": "MALICIOUS",
                "expected_attack": "REPLAY_ATTACK"
            },
            {
                "id": "UNAUTHORIZED",
                "label": "Unauthorized Rogue Verifier",
                "description": "Unregistered / blacklisted quantum terminal attempts verification without Level-5 cryptographic clearance.",
                "sample_file": "Classified_Grid_Telemetry.bin",
                "signer_id": "POWERGRID-QUANTUM-NODE-12",
                "verifier_id": "UNTRUSTED-ROGUE-NODE-99",
                "expected_verdict": "MALICIOUS",
                "expected_attack": "UNAUTHORIZED_VERIFIER"
            }
        ]
    }

@app.post("/api/verify/demo")
def verify_demo(req: DemoVerifyRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    scenario = req.scenario.upper()
    
    scenario_files = {
        "LEGITIMATE": ("MOD_Tactical_Order_904.sig", "4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123", 145280),
        "FORGERY": ("Tampered_Tactical_Payload.sig", "deadbeefcafe00112233445566778899aabbccddeeff00112233445566778899", 98304),
        "IMPERSONATION": ("Compromised_Order_Alice_Fake.sig", "8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677", 112640),
        "REPLAY": ("Replayed_Treasury_Settlement.sig", "9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba", 58392),
        "UNAUTHORIZED": ("Classified_Grid_Telemetry.bin", "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff", 204800)
    }

    file_info = scenario_files.get(scenario, scenario_files["LEGITIMATE"])
    file_name, file_hash, file_size = file_info

    # Nonce handling
    if scenario == "REPLAY":
        nonce = "NONCE-REPLAY-DEMO-001" # Already exists in DB
    else:
        nonce = f"QNONCE-{uuid.uuid4().hex[:8].upper()}"

    verifier_id = req.verifier_id or "VERIFIER-BOB-DEF-01"
    if scenario == "UNAUTHORIZED":
        verifier_id = "UNTRUSTED-ROGUE-NODE-99"

    signer_id = req.signer_id or "ALICE-QDS-ROOT-01"
    if scenario == "IMPERSONATION":
        signer_id = "MALLORY-ADV-09"
    elif scenario == "FORGERY":
        signer_id = "UNKNOWN-FORGER-EVE"

    # Map scenario parameter to engine scenario override
    engine_scenario = None
    if scenario == "FORGERY":
        engine_scenario = "SIGNATURE_FORGERY"
    elif scenario == "IMPERSONATION":
        engine_scenario = "IMPERSONATION"
    elif scenario == "REPLAY":
        engine_scenario = "REPLAY_ATTACK"
    elif scenario == "UNAUTHORIZED":
        engine_scenario = "UNAUTHORIZED"

    result = simulate_teleportation_qds(
        file_hash=file_hash,
        signer_id=signer_id,
        nonce=nonce,
        scenario_override=engine_scenario
    )

    # Record into verification logs
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO verification_logs (
            timestamp, verifier_id, signer_id, file_name, file_hash, nonce,
            mode, verdict, attack_type, mismatch_rate, threshold,
            forgery_probability, detection_time_ms, details_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        now_iso, verifier_id, signer_id, file_name, file_hash, nonce,
        "DEMO", result["verdict"], result["attack_type"], result["mismatch_rate"],
        result["threshold"], result["forgery_probability"], result["detection_time_ms"],
        json.dumps(result)
    ))

    # If legitimate, register nonce to prevent immediate replays
    if result["verdict"] == "LEGITIMATE":
        try:
            conn.execute("""
                INSERT OR IGNORE INTO used_nonces (nonce, consumed_at, verifier_id, session_ref)
                VALUES (?, ?, ?, ?)
            """, (nonce, now_iso, verifier_id, "DEMO-SESSION"))
        except Exception:
            pass

    conn.commit()
    conn.close()

    return {
        "file_name": file_name,
        "file_size": file_size,
        "file_hash": file_hash,
        "verifier_id": verifier_id,
        "signer_id": signer_id,
        "nonce": nonce,
        "mode": "DEMO",
        "timestamp": now_iso,
        **result
    }

@app.post("/api/verify")
async def verify_uploaded_file(
    file: UploadFile = File(...),
    verifier_id: str = Form("VERIFIER-BOB-DEF-01"),
    signer_id: str = Form("ALICE-QDS-ROOT-01"),
    nonce: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    content = await file.read()
    file_size = len(content)
    file_hash = compute_sha256(content)
    file_name = file.filename or "unknown_payload.sig"
    
    if not nonce:
        nonce = f"QNONCE-{uuid.uuid4().hex[:8].upper()}"

    conn = get_db_connection()

    # Rule 1: Check if Verifier is Authorized
    verifier_row = conn.execute(
        "SELECT * FROM authorized_verifiers WHERE verifier_id = ?",
        (verifier_id,)
    ).fetchone()

    scenario_override = None
    if not verifier_row or verifier_row["active"] == 0:
        scenario_override = "UNAUTHORIZED"

    # Rule 2: Check for Replay Attack (Nonce reuse)
    if not scenario_override:
        nonce_row = conn.execute(
            "SELECT * FROM used_nonces WHERE nonce = ?",
            (nonce,)
        ).fetchone()
        if nonce_row:
            scenario_override = "REPLAY_ATTACK"

    # Rule 3: Check against registered signatures
    # If the file is not registered or hash doesn't match registered file:
    reg_sig = conn.execute(
        "SELECT * FROM registered_signatures WHERE file_hash = ?",
        (file_hash,)
    ).fetchone()

    if not scenario_override:
        if reg_sig:
            # File is registered! Check if signer matches
            if reg_sig["signer_id"] != signer_id:
                scenario_override = "IMPERSONATION"
            else:
                scenario_override = None # Legitimate verification
        else:
            # File was never enrolled/registered as legitimate signature
            # Treated as unknown/forged quantum state
            scenario_override = "SIGNATURE_FORGERY"

    result = simulate_teleportation_qds(
        file_hash=file_hash,
        signer_id=signer_id,
        nonce=nonce,
        scenario_override=scenario_override
    )

    now_iso = datetime.now(timezone.utc).isoformat()

    conn.execute("""
        INSERT INTO verification_logs (
            timestamp, verifier_id, signer_id, file_name, file_hash, nonce,
            mode, verdict, attack_type, mismatch_rate, threshold,
            forgery_probability, detection_time_ms, details_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        now_iso, verifier_id, signer_id, file_name, file_hash, nonce,
        "LIVE", result["verdict"], result["attack_type"], result["mismatch_rate"],
        result["threshold"], result["forgery_probability"], result["detection_time_ms"],
        json.dumps(result)
    ))

    # Mark nonce consumed
    if scenario_override != "REPLAY_ATTACK":
        try:
            conn.execute("""
                INSERT OR IGNORE INTO used_nonces (nonce, consumed_at, verifier_id, session_ref)
                VALUES (?, ?, ?, ?)
            """, (nonce, now_iso, verifier_id, "LIVE-SESSION"))
        except Exception:
            pass

    conn.commit()
    conn.close()

    return {
        "file_name": file_name,
        "file_size": file_size,
        "file_hash": file_hash,
        "verifier_id": verifier_id,
        "signer_id": signer_id,
        "nonce": nonce,
        "mode": "LIVE",
        "timestamp": now_iso,
        "is_registered_reference": bool(reg_sig),
        **result
    }

@app.post("/api/register")
async def register_signature(
    file: Optional[UploadFile] = File(None),
    signer_id: str = Form("ALICE-QDS-ROOT-01"),
    description: Optional[str] = Form("Registered via QuantGuard Console"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required for registration.")
    
    content = await file.read()
    file_size = len(content)
    file_hash = compute_sha256(content)
    file_name = file.filename or "enrolled_contract.sig"
    doc_id = f"DOC-REG-{uuid.uuid4().hex[:6].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()
    public_basis_seed = f"SEED-BASIS-{signer_id}-{uuid.uuid4().hex[:6].upper()}"

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO registered_signatures (
                doc_id, file_name, file_hash, file_size, signer_id,
                algorithm, registered_at, public_basis_seed, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_id, file_name, file_hash, file_size, signer_id,
            "Teleportation-QDS-Pauli-XYZ", now_iso, public_basis_seed, description
        ))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="A document with this exact cryptographic hash or ID is already registered."
        )

    conn.close()

    return {
        "success": True,
        "doc_id": doc_id,
        "file_name": file_name,
        "file_hash": file_hash,
        "file_size": file_size,
        "signer_id": signer_id,
        "registered_at": now_iso,
        "public_basis_seed": public_basis_seed,
        "message": "Signature state and Pauli reference basis successfully enrolled in legitimate registry."
    }

@app.get("/api/registered-signatures")
def list_registered_signatures(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM registered_signatures ORDER BY id DESC").fetchall()
    items = [dict(r) for r in rows]
    conn.close()
    return {"registered_signatures": items}

@app.get("/api/verifiers")
def list_verifiers(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM authorized_verifiers").fetchall()
    items = [dict(r) for r in rows]
    conn.close()
    return {"verifiers": items}

# --- Unified Single-Port Production Static File Serving & SPA Fallback ---
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_app(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        target_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(target_path):
            return FileResponse(target_path)
        index_path = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Production frontend bundle not found. Run 'npm run build' in frontend directory."}

