import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "quantguard.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table for registered legitimate signatures / documents
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS registered_signatures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_id TEXT UNIQUE NOT NULL,
            file_name TEXT NOT NULL,
            file_hash TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            signer_id TEXT NOT NULL,
            algorithm TEXT NOT NULL DEFAULT 'Teleportation-QDS-Pauli-XYZ',
            registered_at TEXT NOT NULL,
            public_basis_seed TEXT NOT NULL,
            description TEXT
        )
    """)

    # Table for used nonces to detect Replay attacks
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS used_nonces (
            nonce TEXT PRIMARY KEY,
            consumed_at TEXT NOT NULL,
            verifier_id TEXT NOT NULL,
            session_ref TEXT
        )
    """)

    # Table for authorized verifiers to detect Unauthorized attempts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS authorized_verifiers (
            verifier_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            clearance_level TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            max_rate_per_min INTEGER NOT NULL DEFAULT 60
        )
    """)

    # Table for verification logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS verification_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            verifier_id TEXT NOT NULL,
            signer_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_hash TEXT NOT NULL,
            nonce TEXT NOT NULL,
            mode TEXT NOT NULL, -- 'DEMO' or 'LIVE'
            verdict TEXT NOT NULL, -- 'LEGITIMATE' or 'MALICIOUS'
            attack_type TEXT NOT NULL, -- 'NONE', 'SIGNATURE_FORGERY', 'IMPERSONATION', 'REPLAY_ATTACK', 'UNAUTHORIZED_VERIFIER'
            mismatch_rate REAL NOT NULL,
            threshold REAL NOT NULL,
            forgery_probability REAL NOT NULL,
            detection_time_ms REAL NOT NULL,
            details_json TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
