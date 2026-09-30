export interface User {
  username: string;
  name: string;
  role: string;
  clearance: string;
}

export type QuantumStateSymbol = '|0⟩' | '|1⟩' | '|+⟩' | '|−⟩';
export type MeasurementBasisType = 'Z' | 'X';
export type AuthorizationStatusType = 'AUTHORIZED' | 'PENDING' | 'UNAUTHORIZED' | 'REVOKED';
export type ThreatClassification = 
  | 'None' 
  | 'Signature Forgery' 
  | 'Impersonation' 
  | 'Replay Attack' 
  | 'Unauthorized Verification' 
  | 'Multi-Vector Attack';

export type VerificationVerdict = 'VERIFIED' | 'THREAT DETECTED';
export type ThreatRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VerificationSettings {
  statisticalThreshold: number; // default: 20 (%)
  confidenceThreshold: number;  // default: 85 (%)
  maxFailedAttempts: number;    // default: 3
  replayWindowSeconds: number;  // default: 300
}

export interface PatternBitComparison {
  index: number;
  expected: string;
  observed: string;
  isMismatch: boolean;
}

export interface VerificationInput {
  requestId: string;
  senderIdentity: string;
  claimedIdentity: string;
  authorizationStatus: AuthorizationStatusType;
  quantumState: QuantumStateSymbol;
  measurementBasis: MeasurementBasisType;
  nonce: string;
  measurementSamples: number;
  expectedPattern: string;
  observedPattern: string;
  statisticalThreshold: number;
  confidenceThreshold: number;
  
  // File details
  fileName?: string;
  fileContent?: string;
  fileSize?: number;
  fileType?: string;
  uploadTime?: string;
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

export interface DetailedVerificationResult {
  id: string;
  requestId: string;
  timestamp: string;
  mode: 'DEMO' | 'LIVE';
  
  // Status & Verdict
  status: VerificationVerdict;
  threatType: ThreatClassification;
  isThreat: boolean;
  
  // Evidence & Checks
  senderIdentity: string;
  claimedIdentity: string;
  identityConsistency: 'MATCH' | 'MISMATCH';
  authorizationStatus: 'AUTHORIZED' | 'UNAUTHORIZED';
  nonce: string;
  nonceValidity: 'Unique' | 'Reused';
  integrityStatus: 'VALID' | 'INVALID' | 'NOT CHECKED';
  measurementConsistency: 'PASS' | 'FAIL';
  
  // Quantum Metrics
  quantumState: QuantumStateSymbol;
  measurementBasis: MeasurementBasisType;
  mismatchCount: number;
  totalMeasurements: number;
  mismatchRate: number; // e.g. 12.5 (%)
  statisticalThreshold: number; // e.g. 20 (%)
  confidenceThreshold: number;
  
  // Threat Assessment
  threatAssessment: 'SAFE' | 'SUSPICIOUS' | 'THREAT';
  attackProbability: number; // 0 - 100 (%)
  attackConfidence: number;  // 0 - 100 (%)
  quantumThreatScore: number; // 0 - 100
  threatRiskLevel: ThreatRiskLevel;
  
  // Explanations
  whyDecision: string;
  patternComparison: PatternBitComparison[];
  
  // File info
  fileName?: string;
  fileSize?: number;
  fileHash?: string;
  fileContent?: string;
  detectionTimeMs: number;
}

// Backward compatibility alias for drawer and legacy components
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

export interface VerificationHistoryItem {
  id: string;
  requestId: string;
  timestamp: string;
  sender: string;
  claimedIdentity: string;
  verificationType: 'Demo Simulation' | 'Live Upload' | 'Manual Input';
  threatType: ThreatClassification;
  mismatchRate: number;
  attackProbability: number;
  confidence: number;
  quantumThreatScore: number;
  status: VerificationVerdict;
  fileName: string;
  nonce: string;
  result: DetailedVerificationResult;
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
