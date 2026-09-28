import sqlite3
import os
import json
import time
from datetime import datetime, timedelta, timezone
from database import get_db_connection, init_db

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data for fresh seed
    cursor.execute("DELETE FROM registered_signatures")
    cursor.execute("DELETE FROM authorized_verifiers")
    cursor.execute("DELETE FROM used_nonces")
    cursor.execute("DELETE FROM verification_logs")

    # 1. Authorized Verifiers
    verifiers = [
        ("VERIFIER-BOB-DEF-01", "Defense Ops Center Node Alpha", "Top-Secret-QDS-Level-5", 1, 120),
        ("VERIFIER-CHARLIE-TREAS-02", "RBI Quantum Settlement Gateway", "Secret-Level-4", 1, 90),
        ("VERIFIER-DELTA-GRID-03", "National Power Grid Telemetry Verifier", "Restricted-Level-3", 1, 60),
        ("VERIFIER-ECHO-ISRO-04", "ISRO Ground Segment Node 02", "Top-Secret-QDS-Level-5", 1, 100),
        ("UNTRUSTED-ROGUE-NODE-99", "Unverified Gateway (Blocked)", "Unclassified", 0, 0)
    ]
    cursor.executemany("""
        INSERT INTO authorized_verifiers (verifier_id, name, clearance_level, active, max_rate_per_min)
        VALUES (?, ?, ?, ?, ?)
    """, verifiers)

    # 2. Registered Legitimate Signatures
    registered_sigs = [
        (
            "DOC-DEF-2026-ALPHA",
            "MOD_Tactical_Order_904.sig",
            "4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123",
            145280,
            "ALICE-QDS-ROOT-01",
            "Teleportation-QDS-Pauli-XYZ",
            "2026-09-27T08:30:00Z",
            "SEED-QUANTUM-BASIS-ALICE-DEF-01",
            "Encrypted multi-node tactical movement order signed via entangled QDS."
        ),
        (
            "DOC-FIN-RBI-882",
            "RTGS_Settlement_Batch_771.json",
            "9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
            58392,
            "RBI-QUANTUM-VAULT-04",
            "Teleportation-QDS-Pauli-XYZ",
            "2026-09-27T11:15:00Z",
            "SEED-QUANTUM-BASIS-RBI-FIN-04",
            "Interbank high-value settlement authorization with zero-knowledge tamper audit."
        ),
        (
            "DOC-GRID-SCADA-401",
            "Grid_Frequency_Control_Telemetry.bin",
            "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
            204800,
            "POWERGRID-QUANTUM-NODE-12",
            "Teleportation-QDS-Pauli-XYZ",
            "2026-09-28T02:00:00Z",
            "SEED-QUANTUM-BASIS-GRID-12",
            "Supervisory control instruction for Northern Regional Load Despatch Centre."
        ),
        (
            "DOC-ISRO-SAT-71",
            "Orbital_Correction_Vector_GSAT9.txt",
            "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
            32768,
            "ISRO-QUANTUM-COMM-02",
            "Teleportation-QDS-Pauli-XYZ",
            "2026-09-28T06:45:00Z",
            "SEED-QUANTUM-BASIS-ISRO-02",
            "Geostationary orbital burn commands protected by teleportation non-clonability."
        )
    ]
    cursor.executemany("""
        INSERT INTO registered_signatures (doc_id, file_name, file_hash, file_size, signer_id, algorithm, registered_at, public_basis_seed, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, registered_sigs)

    # 3. Known Used Nonces (for testing replay attack detection)
    nonces = [
        ("NONCE-REPLAY-DEMO-001", "2026-09-28T09:12:44Z", "VERIFIER-BOB-DEF-01", "SESS-847291"),
        ("NONCE-REPLAY-DEMO-002", "2026-09-28T10:05:19Z", "VERIFIER-CHARLIE-TREAS-02", "SESS-910283"),
        ("QNONCE-HIST-9921", "2026-09-28T12:20:00Z", "VERIFIER-DELTA-GRID-03", "SESS-103948")
    ]
    cursor.executemany("""
        INSERT INTO used_nonces (nonce, consumed_at, verifier_id, session_ref)
        VALUES (?, ?, ?, ?)
    """, nonces)

    # 4. Realistic Historical Verification Logs (28 records)
    base_time = datetime.now(timezone.utc) - timedelta(hours=14)
    log_samples = [
        # (offset_mins, verifier_id, signer_id, file_name, file_hash, nonce, mode, verdict, attack, mismatch, threshold, prob, time_ms, details)
        (0, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "MOD_Tactical_Order_904.sig", "4a5b6c7d8e9f0123...", "QNONCE-0101", "LIVE", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 22.4),
        (25, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "RTGS_Settlement_Batch_771.json", "9876543210fe...", "QNONCE-0102", "LIVE", "LEGITIMATE", "NONE", 0.0469, 0.1120, 0.018, 24.1),
        (52, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "MOD_Border_Grid_Telemetry.bin", "c2d3e4f5a6b7...", "QNONCE-0103", "DEMO", "LEGITIMATE", "NONE", 0.0312, 0.1120, 0.009, 21.0),
        (75, "VERIFIER-DELTA-GRID-03", "POWERGRID-QUANTUM-NODE-12", "Grid_Frequency_Control_Telemetry.bin", "112233445566...", "QNONCE-0104", "LIVE", "LEGITIMATE", "NONE", 0.0547, 0.1120, 0.027, 26.8),
        # An attack: Forgery
        (98, "VERIFIER-BOB-DEF-01", "UNKNOWN-ORIGIN-99", "Tampered_Tactical_Order.sig", "ff00ea21bc89...", "QNONCE-0105", "DEMO", "MALICIOUS", "SIGNATURE_FORGERY", 0.3359, 0.1120, 0.988, 38.4),
        (130, "VERIFIER-ECHO-ISRO-04", "ISRO-QUANTUM-COMM-02", "Orbital_Correction_Vector_GSAT9.txt", "a1b2c3d4e5f6...", "QNONCE-0106", "LIVE", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 23.0),
        (160, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "Forex_Clearing_Notice_402.sig", "334455667788...", "QNONCE-0107", "DEMO", "LEGITIMATE", "NONE", 0.0469, 0.1120, 0.019, 22.9),
        # An attack: Impersonation
        (190, "VERIFIER-BOB-DEF-01", "MALLORY-ADV-09", "Forged_Credentials_Alice.sig", "998877665544...", "QNONCE-0108", "DEMO", "MALICIOUS", "IMPERSONATION", 0.4141, 0.1120, 0.999, 41.2),
        (220, "VERIFIER-DELTA-GRID-03", "POWERGRID-QUANTUM-NODE-12", "Substation_Relay_Config.json", "887766554433...", "QNONCE-0109", "LIVE", "LEGITIMATE", "NONE", 0.0430, 0.1120, 0.015, 25.0),
        (255, "VERIFIER-ECHO-ISRO-04", "ISRO-QUANTUM-COMM-02", "Payload_Sensor_Calibration.sig", "665544332211...", "QNONCE-0110", "DEMO", "LEGITIMATE", "NONE", 0.0352, 0.1120, 0.010, 21.8),
        # An attack: Replay Attack
        (290, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "RTGS_Settlement_Batch_771.json", "9876543210fe...", "NONCE-REPLAY-DEMO-001", "DEMO", "MALICIOUS", "REPLAY_ATTACK", 0.0430, 0.1120, 0.999, 19.5),
        (330, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "MOD_Tactical_Order_904.sig", "4a5b6c7d8e9f0123...", "QNONCE-0112", "LIVE", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 22.1),
        # An attack: Unauthorized Verifier
        (370, "UNTRUSTED-ROGUE-NODE-99", "ALICE-QDS-ROOT-01", "Intercepted_State_Telemetry.sig", "4a5b6c7d8e9f0123...", "QNONCE-0113", "DEMO", "MALICIOUS", "UNAUTHORIZED_VERIFIER", 0.0410, 0.1120, 0.999, 18.2),
        (410, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "C2_Encrypted_Channel_Keys.sig", "1234abcd5678...", "QNONCE-0114", "LIVE", "LEGITIMATE", "NONE", 0.0469, 0.1120, 0.018, 23.7),
        (450, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "SWIFT_ISO20022_Message.xml", "556677889900...", "QNONCE-0115", "DEMO", "LEGITIMATE", "NONE", 0.0312, 0.1120, 0.009, 21.3),
        (490, "VERIFIER-DELTA-GRID-03", "POWERGRID-QUANTUM-NODE-12", "Sync_Phasor_Measurement.dat", "aabbccddeeff...", "QNONCE-0116", "LIVE", "LEGITIMATE", "NONE", 0.0508, 0.1120, 0.022, 24.6),
        # Another forgery attempt
        (530, "VERIFIER-BOB-DEF-01", "EVE-INTERCEPTOR", "Fake_Troop_Deployment.sig", "deadbeef0011...", "QNONCE-0117", "DEMO", "MALICIOUS", "SIGNATURE_FORGERY", 0.3516, 0.1120, 0.994, 37.9),
        (570, "VERIFIER-ECHO-ISRO-04", "ISRO-QUANTUM-COMM-02", "Launch_Readiness_Review.sig", "cafebabe2233...", "QNONCE-0118", "LIVE", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 22.8),
        (610, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "Radar_Track_Signature.bin", "9900aabbccdd...", "QNONCE-0119", "DEMO", "LEGITIMATE", "NONE", 0.0430, 0.1120, 0.015, 23.1),
        (650, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "Interbank_Daily_Audit.sig", "1133557799bb...", "QNONCE-0120", "LIVE", "LEGITIMATE", "NONE", 0.0352, 0.1120, 0.010, 21.9),
        (690, "VERIFIER-DELTA-GRID-03", "POWERGRID-QUANTUM-NODE-12", "Transformer_Trip_Protection.sig", "2244668800cc...", "QNONCE-0121", "LIVE", "LEGITIMATE", "NONE", 0.0469, 0.1120, 0.018, 25.3),
        (720, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "MOD_Tactical_Order_904.sig", "4a5b6c7d8e9f0123...", "QNONCE-0122", "DEMO", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 22.2),
        # Another replay attack attempt
        (750, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "MOD_Tactical_Order_904.sig", "4a5b6c7d8e9f0123...", "NONCE-REPLAY-DEMO-002", "DEMO", "MALICIOUS", "REPLAY_ATTACK", 0.0391, 0.1120, 0.999, 18.9),
        (780, "VERIFIER-ECHO-ISRO-04", "ISRO-QUANTUM-COMM-02", "Solar_Array_Telemetry.sig", "3355779911aa...", "QNONCE-0124", "LIVE", "LEGITIMATE", "NONE", 0.0312, 0.1120, 0.009, 21.5),
        (805, "VERIFIER-CHARLIE-TREAS-02", "RBI-QUANTUM-VAULT-04", "Treasury_Bond_Auction.sig", "4466880022bb...", "QNONCE-0125", "DEMO", "LEGITIMATE", "NONE", 0.0469, 0.1120, 0.019, 23.4),
        (825, "VERIFIER-BOB-DEF-01", "ALICE-QDS-ROOT-01", "Encrypted_QKD_Keyblock.sig", "5577991133cc...", "QNONCE-0126", "LIVE", "LEGITIMATE", "NONE", 0.0391, 0.1120, 0.012, 22.6),
        (840, "VERIFIER-DELTA-GRID-03", "POWERGRID-QUANTUM-NODE-12", "Smart_Meter_Batch_North.sig", "6688002244dd...", "QNONCE-0127", "DEMO", "LEGITIMATE", "NONE", 0.0430, 0.1120, 0.015, 24.2),
    ]

    for item in log_samples:
        t_stamp = (base_time + timedelta(minutes=item[0])).isoformat()
        details = {
            "num_qubits": 128,
            "basis_X": {"mismatch_rate": round(item[9] * 0.95, 4), "expected": 0.042},
            "basis_Y": {"mismatch_rate": round(item[9] * 1.05, 4), "expected": 0.042},
            "basis_Z": {"mismatch_rate": round(item[9] * 1.00, 4), "expected": 0.042},
            "protocol": "Teleportation-QDS-Pauli-XYZ",
            "anomaly_reason": "Statistical QBER exceeded threshold" if item[7] == "MALICIOUS" else "Nominal teleportation fidelity"
        }
        cursor.execute("""
            INSERT INTO verification_logs (
                timestamp, verifier_id, signer_id, file_name, file_hash, nonce,
                mode, verdict, attack_type, mismatch_rate, threshold,
                forgery_probability, detection_time_ms, details_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t_stamp, item[1], item[2], item[3], item[4], item[5],
            item[6], item[7], item[8], item[9], item[10],
            item[11], item[12], json.dumps(details)
        ))

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic QDS historical data!")

if __name__ == "__main__":
    seed_database()
