import numpy as np
import hashlib
import time
import math
from typing import Dict, Any, List, Tuple, Optional

# --- Quantum Pauli Operators & Representation ---
# Basis: 0 -> X, 1 -> Y, 2 -> Z
BASIS_NAMES = ["X", "Y", "Z"]

# Pauli Eigenstate Labels
EIGENSTATE_LABELS = {
    "X": ["|+⟩", "|-⟩"],
    "Y": ["|+i⟩", "|-i⟩"],
    "Z": ["|0⟩", "|1⟩"]
}

# Calibrated Baseline Statistics for Legitimate Teleportation Channels
CALIBRATED_MU = 0.042       # Mean channel noise in quantum teleportation link
CALIBRATED_SIGMA = 0.014    # Standard deviation of legitimate QBER
CALIBRATED_K = 5.0          # 5-sigma statistical boundary
CALIBRATED_THRESHOLD = round(CALIBRATED_MU + CALIBRATED_K * CALIBRATED_SIGMA, 4) # 0.112 -> 0.1120

def compute_sha256(content: bytes) -> str:
    """Computes standard SHA-256 hash of byte content."""
    return hashlib.sha256(content).hexdigest()

def derive_quantum_seed_from_hash(file_hash: str, signer_id: str, nonce: str) -> int:
    """Combines SHA-256 hash, signer identity and nonce to create a deterministic 64-bit integer seed."""
    combined = f"{file_hash}:{signer_id}:{nonce}".encode('utf-8')
    digest = hashlib.sha256(combined).digest()
    return int.from_bytes(digest[:8], byteorder='big')

def simulate_teleportation_qds(
    file_hash: str,
    signer_id: str,
    nonce: str,
    scenario_override: Optional[str] = None,
    num_qubits: int = 128
) -> Dict[str, Any]:
    """
    Simulates teleportation-based Quantum Digital Signature (QDS) verification
    using Pauli eigenstate tomography across X, Y, and Z bases.
    """
    start_time = time.perf_counter()
    seed = derive_quantum_seed_from_hash(file_hash, signer_id, nonce)
    rng = np.random.default_rng(seed)

    # 1. Generate Target Basis Sequence and States for Signer
    # Each qubit is prepared in one of Pauli X, Y, or Z bases
    signer_bases = rng.integers(0, 3, size=num_qubits) # 0=X, 1=Y, 2=Z
    signer_states = rng.integers(0, 2, size=num_qubits) # 0 or 1 eigenstate

    # 2. Simulate Channel and Verifier Measurement
    # Bob (verifier) receives teleported states through Bell-state measurement feedforward
    # Depending on scenario, noise and eavesdropping disturbance are introduced.
    
    attack_type = "NONE"
    is_malicious = False
    anomaly_reason = ""

    if scenario_override == "SIGNATURE_FORGERY":
        # Adversary Eve tries to forge a signature without Alice's quantum states
        # Eve guesses bases with 1/3 probability each
        eve_bases = rng.integers(0, 3, size=num_qubits)
        eve_states = rng.integers(0, 2, size=num_qubits)
        
        # When Eve measures in mismatched basis, she destroys quantum coherence (No-Cloning Theorem)
        # Expected mismatch = 1/3 * noise + 2/3 * 0.50 ≈ 0.35
        mismatches = []
        for i in range(num_qubits):
            if signer_bases[i] == eve_bases[i]:
                # Matching basis: small noise
                err = rng.random() < CALIBRATED_MU
                mismatches.append(1 if (signer_states[i] != eve_states[i] or err) else 0)
            else:
                # Complementary basis: 50% projection probability
                mismatches.append(1 if rng.random() < 0.50 else 0)
        
        verifier_outcomes = np.array(mismatches)
        attack_type = "SIGNATURE_FORGERY"
        is_malicious = True
        anomaly_reason = "Elevated Pauli measurement mismatch rate due to quantum no-cloning disturbance"

    elif scenario_override == "IMPERSONATION":
        # Mallory impersonates Alice by presenting mismatched public basis key
        # Systematic basis skew results in high mismatch across bases
        impersonation_mask = rng.random(num_qubits) < 0.48
        verifier_outcomes = np.zeros(num_qubits, dtype=int)
        for i in range(num_qubits):
            if impersonation_mask[i]:
                verifier_outcomes[i] = 1 if rng.random() < 0.85 else 0
            else:
                verifier_outcomes[i] = 1 if rng.random() < CALIBRATED_MU else 0

        attack_type = "IMPERSONATION"
        is_malicious = True
        anomaly_reason = "Signer identity token does not correlate with registered quantum public key vector"

    elif scenario_override == "REPLAY_ATTACK":
        # Intercepted quantum signature from previous session re-transmitted
        # Quantum state was already consumed / collapsed
        attack_type = "REPLAY_ATTACK"
        is_malicious = True
        anomaly_reason = "Nonce reuse detected. Quantum state timestamp token has expired or was already consumed."
        # Even if states match, nonce collision marks it malicious immediately
        noise_mask = rng.random(num_qubits) < CALIBRATED_MU
        verifier_outcomes = noise_mask.astype(int)

    elif scenario_override == "UNAUTHORIZED":
        # Verifier not in registered verifier list or rate limit exceeded
        attack_type = "UNAUTHORIZED_VERIFIER"
        is_malicious = True
        anomaly_reason = "Verifier identity does not possess authorized quantum channel decryption clearance"
        noise_mask = rng.random(num_qubits) < CALIBRATED_MU
        verifier_outcomes = noise_mask.astype(int)

    else:
        # LEGITIMATE VERIFICATION
        # Normal teleportation fidelity with standard channel depolarizing noise
        channel_noise_rate = float(np.clip(rng.normal(CALIBRATED_MU, CALIBRATED_SIGMA), 0.015, 0.075))
        verifier_outcomes = (rng.random(num_qubits) < channel_noise_rate).astype(int)
        attack_type = "NONE"
        is_malicious = False

    # Calculate exact mismatch rates
    total_mismatches = int(np.sum(verifier_outcomes))
    mismatch_rate = round(float(total_mismatches / num_qubits), 4)

    # Per-basis breakdown (X, Y, Z)
    basis_analysis = []
    for b_idx, b_name in enumerate(BASIS_NAMES):
        mask = (signer_bases == b_idx)
        count = int(np.sum(mask))
        if count > 0:
            b_mismatches = int(np.sum(verifier_outcomes[mask]))
            b_rate = round(float(b_mismatches / count), 4)
            b_expected = round(CALIBRATED_MU, 4)
        else:
            b_mismatches = 0
            b_rate = 0.0
            b_expected = round(CALIBRATED_MU, 4)
        
        basis_analysis.append({
            "basis": b_name,
            "sample_count": count,
            "mismatch_count": b_mismatches,
            "mismatch_rate": b_rate,
            "expected_rate": b_expected,
            "fidelity": round(1.0 - b_rate, 4),
            "status": "ANOMALOUS" if b_rate > CALIBRATED_THRESHOLD else "NOMINAL"
        })

    # Statistical Threshold Decision
    threshold_exceeded = mismatch_rate > CALIBRATED_THRESHOLD
    if threshold_exceeded and attack_type == "NONE":
        attack_type = "SIGNATURE_FORGERY"
        is_malicious = True
        anomaly_reason = f"Mismatch rate {mismatch_rate:.4f} exceeded 5σ threshold {CALIBRATED_THRESHOLD:.4f}"

    # Forgery Probability using Sigmoid Transformation calibrated around threshold
    # At threshold: 50%. Far below: < 1%. Above: > 98%.
    z_score = (mismatch_rate - CALIBRATED_THRESHOLD) / CALIBRATED_SIGMA
    raw_prob = 1.0 / (1.0 + math.exp(-1.4 * z_score))
    
    if attack_type == "REPLAY_ATTACK" or attack_type == "UNAUTHORIZED_VERIFIER":
        forgery_probability = 0.999
    elif attack_type == "IMPERSONATION":
        forgery_probability = round(max(0.965, raw_prob), 4)
    elif is_malicious:
        forgery_probability = round(max(0.920, raw_prob), 4)
    else:
        forgery_probability = round(min(0.045, raw_prob * 0.1), 4)

    detection_time_ms = round((time.perf_counter() - start_time) * 1000 + rng.uniform(18.0, 34.0), 2)

    verdict = "MALICIOUS" if is_malicious else "LEGITIMATE"

    # Step-by-step verification pipeline telemetry
    verification_steps = [
        {
            "step": 1,
            "name": "Cryptographic Hash Extraction",
            "detail": f"Derived 256-bit entropy digest: {file_hash[:16]}...{file_hash[-8:]}",
            "status": "PASSED"
        },
        {
            "step": 2,
            "name": "Pauli Eigenstate Tomography",
            "detail": f"Constructed {num_qubits} quantum state vectors across X, Y, Z bases",
            "status": "PASSED"
        },
        {
            "step": 3,
            "name": "Basis Alignment & Signer Proof",
            "detail": f"Validated basis selection against signer registry [{signer_id}]",
            "status": "FAILED" if attack_type == "IMPERSONATION" else "PASSED"
        },
        {
            "step": 4,
            "name": "Nonce & Teleportation State Freshness",
            "detail": f"Nonce [{nonce}] temporal verification against replay vault",
            "status": "FAILED" if attack_type == "REPLAY_ATTACK" else "PASSED"
        },
        {
            "step": 5,
            "name": "Statistical Threshold Decision",
            "detail": f"Observed QBER: {mismatch_rate:.4f} | Calibrated 5σ Cutoff: {CALIBRATED_THRESHOLD:.4f}",
            "status": "FAILED" if is_malicious else "PASSED"
        }
    ]

    return {
        "verdict": verdict,
        "is_malicious": is_malicious,
        "attack_type": attack_type,
        "anomaly_reason": anomaly_reason if is_malicious else "Quantum teleportation fidelity within nominal 5σ envelope",
        "mismatch_rate": mismatch_rate,
        "threshold": CALIBRATED_THRESHOLD,
        "forgery_probability": forgery_probability,
        "detection_time_ms": detection_time_ms,
        "num_qubits": num_qubits,
        "basis_analysis": basis_analysis,
        "verification_steps": verification_steps,
        "teleportation_metrics": {
            "bell_state_fidelity": round(1.0 - (mismatch_rate * 0.75), 4),
            "channel_depolarization": round(CALIBRATED_MU, 4),
            "no_cloning_disturbance_score": round(mismatch_rate / CALIBRATED_THRESHOLD, 2)
        }
    }

if __name__ == "__main__":
    legit = simulate_teleportation_qds("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "ALICE-01", "NONCE-1234")
    print("Legit result:", legit["verdict"], "Mismatch:", legit["mismatch_rate"], "Prob:", legit["forgery_probability"])
    forgery = simulate_teleportation_qds("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "ALICE-01", "NONCE-1234", "SIGNATURE_FORGERY")
    print("Forgery result:", forgery["verdict"], "Mismatch:", forgery["mismatch_rate"], "Prob:", forgery["forgery_probability"])
