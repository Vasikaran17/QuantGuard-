export interface User {
  username: string;
  name: string;
  role: string;
  clearance: string;
}

export interface VerificationStep {
  step: number;
  name: string;
  detail: string;
  status: 'PASSED' | 'FAILED' | 'PENDING' | 'RUNNING';
}

export interface BasisOutcome {
  basis: string;
  sample_count: number;
  mismatch_count: number;
  mismatch_rate: number;
  expected_rate: number;
  fidelity: number;
  status: 'NOMINAL' | 'ANOMALOUS';
}

export interface TeleportationMetrics {
  bell_state_fidelity: number;
  channel_depolarization: number;
  no_cloning_disturbance_score: number;
}

export interface VerificationResult {
  file_name: string;
  file_size: number;
  file_hash: string;
  verifier_id: string;
  signer_id: string;
  nonce: string;
  mode: 'DEMO' | 'LIVE';
  timestamp: string;
  verdict: 'LEGITIMATE' | 'MALICIOUS';
  is_malicious: boolean;
  attack_type: 'NONE' | 'SIGNATURE_FORGERY' | 'IMPERSONATION' | 'REPLAY_ATTACK' | 'UNAUTHORIZED_VERIFIER';
  anomaly_reason: string;
  mismatch_rate: number;
  threshold: number;
  forgery_probability: number;
  detection_time_ms: number;
  num_qubits: number;
  basis_analysis: BasisOutcome[];
  verification_steps: VerificationStep[];
  teleportation_metrics: TeleportationMetrics;
  is_registered_reference?: boolean;
}

export interface DashboardStats {
  total_verifications: number;
  legitimate_count: number;
  malicious_count: number;
  malicious_ratio: number;
  threat_level: 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';
  threat_color: 'teal' | 'amber' | 'red';
  threat_description: string;
  attack_breakdown: {
    SIGNATURE_FORGERY: number;
    IMPERSONATION: number;
    REPLAY_ATTACK: number;
    UNAUTHORIZED_VERIFIER: number;
  };
  calibrated_threshold: number;
  simulation_note: string;
}

export interface ThresholdPoint {
  index: number;
  timestamp: string;
  mismatch_rate: number;
  threshold: number;
  verdict: string;
  attack_type: string;
  forgery_prob: number;
  is_anomaly: boolean;
}

export interface BasisMetric {
  basis: string;
  expected_noise: number;
  observed_legit: number;
  observed_attack: number;
  threshold: number;
  fidelity: number;
}

export interface SystemMetrics {
  detection_accuracy: number;
  false_positive_rate: number;
  avg_detection_time_ms: number;
  security_score: number;
  calibrated_threshold: number;
  threshold_points: ThresholdPoint[];
  basis_metrics: BasisMetric[];
}

export interface LogEntry {
  id: number;
  timestamp: string;
  verifier_id: string;
  signer_id: string;
  file_name: string;
  file_hash: string;
  nonce: string;
  mode: 'DEMO' | 'LIVE';
  verdict: 'LEGITIMATE' | 'MALICIOUS';
  attack_type: string;
  mismatch_rate: number;
  threshold: number;
  forgery_probability: number;
  detection_time_ms: number;
  details?: any;
}

export interface DemoScenario {
  id: string;
  label: string;
  description: string;
  sample_file: string;
  signer_id: string;
  verifier_id: string;
  expected_verdict: string;
  expected_attack: string;
}
