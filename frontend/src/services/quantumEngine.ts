import {
  VerificationInput,
  DetailedVerificationResult,
  VerificationHistoryItem,
  PatternBitComparison,
  ThreatClassification,
  VerificationVerdict,
  ThreatRiskLevel,
  QuantumStateSymbol,
  MeasurementBasisType,
  AuthorizationStatusType
} from '../types';

/**
 * Standard default verification settings
 */
export const DEFAULT_SETTINGS = {
  statisticalThreshold: 20, // 20%
  confidenceThreshold: 85,  // 85%
  maxFailedAttempts: 3,
  replayWindowSeconds: 300,
};

/**
 * Parse a pattern string like "0 1 0 1" or "0101" or "0, 1, 0" into clean bit array
 */
export function parseBitPattern(str: string): string[] {
  if (!str) return [];
  // Extract all 0 and 1 characters
  const bits = str.replace(/[^01]/g, '').split('');
  return bits.length > 0 ? bits : ['0', '1', '0', '1', '0', '1', '0', '1'];
}

/**
 * Core Quantum-Inspired Verification Engine
 * Analyzes quantum state patterns, identity, nonce freshness, and authorization status
 */
export function calculateVerification(
  input: VerificationInput,
  history: VerificationHistoryItem[] = []
): DetailedVerificationResult {
  const startTime = performance.now();
  
  const expectedBits = parseBitPattern(input.expectedPattern);
  const observedBits = parseBitPattern(input.observedPattern);
  
  const totalMeasurements = Math.max(expectedBits.length, observedBits.length, 1);
  const patternComparison: PatternBitComparison[] = [];
  let mismatchCount = 0;
  
  for (let i = 0; i < totalMeasurements; i++) {
    const exp = expectedBits[i % expectedBits.length] || '0';
    const obs = observedBits[i % observedBits.length] || '0';
    const isMismatch = exp !== obs;
    if (isMismatch) mismatchCount++;
    
    patternComparison.push({
      index: i + 1,
      expected: exp,
      observed: obs,
      isMismatch
    });
  }

  // 1. Mismatch calculation & Threshold check
  const mismatchRate = Number(((mismatchCount / totalMeasurements) * 100).toFixed(1));
  const isMismatchFailure = mismatchRate > input.statisticalThreshold;
  
  // 2. Identity consistency check
  const cleanSender = (input.senderIdentity || '').trim().toUpperCase();
  const cleanClaimed = (input.claimedIdentity || '').trim().toUpperCase();
  const isIdentityMatch = cleanSender !== '' && cleanSender === cleanClaimed;
  const isIdentityFailure = !isIdentityMatch;
  
  // 3. Nonce freshness / Replay check
  const cleanNonce = (input.nonce || '').trim();
  // Check if this nonce exists in previous history
  const isNonceReused = cleanNonce !== '' && history.some(item => 
    item.nonce.trim() === cleanNonce && item.requestId !== input.requestId
  );
  const isReplayFailure = isNonceReused;
  
  // 4. Authorization check
  const isAuthValid = input.authorizationStatus === 'AUTHORIZED';
  const isAuthFailure = !isAuthValid;

  // Determine failures and classification
  const failures: string[] = [];
  if (isIdentityFailure) failures.push('Identity Mismatch');
  if (isReplayFailure) failures.push('Reused Nonce / State Collision');
  if (isMismatchFailure) failures.push(`High Measurement Mismatch (${mismatchRate}% > ${input.statisticalThreshold}%)`);
  if (isAuthFailure) failures.push(`Invalid Authorization Status (${input.authorizationStatus})`);

  let threatType: ThreatClassification = 'None';
  if (failures.length > 1) {
    threatType = 'Multi-Vector Attack';
  } else if (isIdentityFailure) {
    threatType = 'Impersonation';
  } else if (isReplayFailure) {
    threatType = 'Replay Attack';
  } else if (isMismatchFailure) {
    threatType = 'Signature Forgery';
  } else if (isAuthFailure) {
    threatType = 'Unauthorized Verification';
  }

  const isThreat = threatType !== 'None';
  const status: VerificationVerdict = isThreat ? 'THREAT DETECTED' : 'VERIFIED';

  // Calculate dynamic Attack Probability (0 - 100%)
  let attackProbability = 0;
  if (!isThreat) {
    attackProbability = Number((Math.max(2.1, mismatchRate * 0.45)).toFixed(1));
  } else if (threatType === 'Signature Forgery') {
    const excess = Math.max(0, mismatchRate - input.statisticalThreshold);
    attackProbability = Number(Math.min(98.8, 76.5 + excess * 0.7).toFixed(1));
  } else if (threatType === 'Impersonation') {
    attackProbability = Number((88.4 + (Math.random() * 5)).toFixed(1));
  } else if (threatType === 'Replay Attack') {
    attackProbability = Number((94.2 + (Math.random() * 4)).toFixed(1));
  } else if (threatType === 'Unauthorized Verification') {
    attackProbability = Number((91.0 + (Math.random() * 5)).toFixed(1));
  } else {
    // Multi-Vector
    attackProbability = Number((98.5 + (Math.random() * 1.4)).toFixed(1));
  }

  // Calculate dynamic Attack Confidence (0 - 100%)
  const sampleFactor = Math.min(1.0, totalMeasurements / 16);
  let attackConfidence = Number((82 + sampleFactor * 16).toFixed(1));
  if (isThreat) {
    attackConfidence = Number(Math.min(99.4, attackConfidence + 2.5).toFixed(1));
  }

  // Calculate Quantum Threat Score (0 - 100)
  let quantumThreatScore = 0;
  if (!isThreat) {
    quantumThreatScore = Math.round(mismatchRate * 0.8 + 4);
  } else {
    const baseScore = threatType === 'Multi-Vector Attack' ? 95 :
                      threatType === 'Replay Attack' ? 88 :
                      threatType === 'Signature Forgery' ? Math.round(65 + (mismatchRate * 0.5)) :
                      threatType === 'Impersonation' ? 82 : 78;
    quantumThreatScore = Math.min(100, Math.max(62, baseScore));
  }

  // Threat Risk Level
  let threatRiskLevel: ThreatRiskLevel = 'LOW';
  if (quantumThreatScore > 80) threatRiskLevel = 'CRITICAL';
  else if (quantumThreatScore > 60) threatRiskLevel = 'HIGH';
  else if (quantumThreatScore > 30) threatRiskLevel = 'MEDIUM';

  // Threat Assessment
  const threatAssessment: 'SAFE' | 'SUSPICIOUS' | 'THREAT' = 
    threatRiskLevel === 'LOW' ? 'SAFE' :
    threatRiskLevel === 'MEDIUM' ? 'SUSPICIOUS' : 'THREAT';

  // Generate dynamic explanation: "Why this decision?"
  let whyDecision = '';
  if (!isThreat) {
    whyDecision = `Measurement mismatch rate (${mismatchRate}%) remained strictly below the configured statistical threshold (${input.statisticalThreshold}%). Sender identity ('${cleanSender}') matches claimed identity and nonce validation confirmed an unused, fresh quantum state. The signature is classified as VERIFIED.`;
  } else if (threatType === 'Signature Forgery') {
    whyDecision = `Measurement mismatch (${mismatchRate}%) decisively exceeded the statistical decision boundary of ${input.statisticalThreshold}%. The observed quantum measurement pattern collapsed into non-orthogonal basis states across ${mismatchCount} sample positions, indicating adversarial interception or state forgery consistent with the Quantum No-Cloning Theorem.`;
  } else if (threatType === 'Impersonation') {
    whyDecision = `Claimed identity ('${cleanClaimed}') does not match registered sender identity ('${cleanSender}'). Entangled basis alignment failed during identity verification. The verification request is rejected as an IMPERSONATION attempt.`;
  } else if (threatType === 'Replay Attack') {
    whyDecision = `Nonce identifier ('${cleanNonce}') was previously recorded in verification history within the temporal detection window. Quantum teleportation states cannot be cloned or re-measured due to wave-function collapse. The verification request is rejected as a REPLAY ATTACK.`;
  } else if (threatType === 'Unauthorized Verification') {
    whyDecision = `Authorization check failed with status '${input.authorizationStatus}'. Terminal credentials do not hold authorized verifier clearance. Access is rejected as an UNAUTHORIZED VERIFICATION attempt.`;
  } else {
    whyDecision = `Multiple severe security violations detected simultaneously (${failures.join(', ')}). The signature request exhibits characteristics of a coordinated MULTI-VECTOR ATTACK.`;
  }

  const detectionTimeMs = Math.max(12, Math.round(performance.now() - startTime + Math.random() * 8 + 14));

  return {
    id: `VER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    requestId: input.requestId || `REQ-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    mode: input.fileName?.includes('demo') ? 'DEMO' : 'LIVE',
    status,
    threatType,
    isThreat,
    senderIdentity: cleanSender,
    claimedIdentity: cleanClaimed,
    identityConsistency: isIdentityMatch ? 'MATCH' : 'MISMATCH',
    authorizationStatus: isAuthValid ? 'AUTHORIZED' : 'UNAUTHORIZED',
    nonce: cleanNonce,
    nonceValidity: isNonceReused ? 'Reused' : 'Unique',
    integrityStatus: isThreat ? 'INVALID' : 'VALID',
    measurementConsistency: isMismatchFailure ? 'FAIL' : 'PASS',
    quantumState: input.quantumState || '|0⟩',
    measurementBasis: input.measurementBasis || 'Z',
    mismatchCount,
    totalMeasurements,
    mismatchRate,
    statisticalThreshold: input.statisticalThreshold,
    confidenceThreshold: input.confidenceThreshold,
    threatAssessment,
    attackProbability,
    attackConfidence,
    quantumThreatScore,
    threatRiskLevel,
    whyDecision,
    patternComparison,
    fileName: input.fileName || 'quantum_signature.sig',
    fileSize: input.fileSize || 1420,
    fileContent: input.fileContent,
    detectionTimeMs
  };
}

/**
 * Generate Realistic Dynamic Demo Scenarios
 */
export function generateDemoScenario(
  scenarioType: 'NORMAL' | 'FORGERY' | 'IMPERSONATION' | 'REPLAY' | 'UNAUTHORIZED',
  history: VerificationHistoryItem[] = []
): VerificationInput {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  
  // Base 16-bit patterns
  const basePatterns = [
    '0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0',
    '1 0 0 1 1 1 0 0 0 1 1 0 1 0 0 1',
    '0 0 1 1 0 1 1 0 1 1 0 0 1 0 1 0',
    '1 1 0 0 1 0 1 0 0 1 0 1 1 1 0 0',
  ];
  const expected = basePatterns[Math.floor(Math.random() * basePatterns.length)];
  const expectedBits = expected.split(' ');

  let observedBits = [...expectedBits];
  let sender = 'ALICE-QDS-NODE-01';
  let claimed = 'ALICE-QDS-NODE-01';
  let authStatus: AuthorizationStatusType = 'AUTHORIZED';
  let qState: QuantumStateSymbol = '|0⟩';
  let basis: MeasurementBasisType = 'Z';
  let nonce = `NONCE-QDS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${randomSuffix}`;
  let scenarioDesc = '';
  let sampleFileName = 'quantum_signature.sig';

  switch (scenarioType) {
    case 'NORMAL':
      // 0 or 1 random flip (mismatch rate <= 6.25% < 20%)
      if (Math.random() > 0.5) {
        const flipIdx = Math.floor(Math.random() * observedBits.length);
        observedBits[flipIdx] = observedBits[flipIdx] === '0' ? '1' : '0';
      }
      sender = 'ALICE-QDS-NODE-01';
      claimed = 'ALICE-QDS-NODE-01';
      authStatus = 'AUTHORIZED';
      qState = Math.random() > 0.5 ? '|0⟩' : '|+⟩';
      basis = qState === '|0⟩' ? 'Z' : 'X';
      scenarioDesc = 'Nominal quantum channel with low depolarizing noise (mismatch < 20%)';
      sampleFileName = 'MOD_Tactical_Order_904.sig';
      break;

    case 'FORGERY':
      // Flip 6 to 8 bits to simulate adversarial No-Cloning wave collapse (> 35% mismatch)
      const flipCount = 6 + Math.floor(Math.random() * 3);
      const indicesToFlip = new Set<number>();
      while (indicesToFlip.size < flipCount) {
        indicesToFlip.add(Math.floor(Math.random() * observedBits.length));
      }
      indicesToFlip.forEach(idx => {
        observedBits[idx] = observedBits[idx] === '0' ? '1' : '0';
      });
      sender = 'ALICE-QDS-NODE-01';
      claimed = 'ALICE-QDS-NODE-01';
      authStatus = 'AUTHORIZED';
      qState = '|1⟩';
      basis = 'Z';
      scenarioDesc = 'Adversary Eve forged signature; basis mismatch collapses wave-function';
      sampleFileName = 'Tampered_Adversary_Payload.sig';
      break;

    case 'IMPERSONATION':
      // Mallory tries to sign as Alice
      sender = 'MALLORY-ROGUE-09';
      claimed = 'ALICE-QDS-NODE-01';
      authStatus = 'AUTHORIZED';
      qState = '|−⟩';
      basis = 'X';
      scenarioDesc = 'Mallory poses as Alice with mismatched public key basis';
      sampleFileName = 'Impersonated_Claim_Ticket.json';
      break;

    case 'REPLAY':
      // REUSE an existing nonce from history if available so replay detector triggers!
      if (history.length > 0) {
        // Pick the most recent nonce from history
        const picked = history[0];
        nonce = picked.nonce || `NONCE-REPLAY-COLLISION-9942`;
      } else {
        nonce = `NONCE-INTERCEPTED-SESSION-7721`;
      }
      sender = 'ALICE-QDS-NODE-01';
      claimed = 'ALICE-QDS-NODE-01';
      authStatus = 'AUTHORIZED';
      qState = '|0⟩';
      basis = 'Z';
      scenarioDesc = 'Previously used signature re-transmitted over the relay';
      sampleFileName = 'Replayed_Settlement_Batch.sig';
      break;

    case 'UNAUTHORIZED':
      sender = 'UNKNOWN-GATEWAY-X';
      claimed = 'UNKNOWN-GATEWAY-X';
      authStatus = 'UNAUTHORIZED';
      qState = '|1⟩';
      basis = 'Z';
      scenarioDesc = 'Terminal without Level-5 cryptographic clearance attempted state decryption';
      sampleFileName = 'Unauthorized_Terminal_Request.dat';
      break;
  }

  const observed = observedBits.join(' ');
  const requestId = `REQ-DEMO-${now.getFullYear()}-${randomSuffix}`;

  // Build realistic signature file content (formatted JSON)
  const fileContentObj = {
    signatureId: `SIG-${randomSuffix}-QDS`,
    senderIdentity: sender,
    claimedIdentity: claimed,
    quantumState: qState,
    measurementBasis: `${basis} Basis`,
    nonce: nonce,
    measurementSamples: expectedBits.length,
    expectedPattern: expected,
    observedPattern: observed,
    timestamp: now.toISOString(),
    authorizationStatus: authStatus,
    scenarioLabel: scenarioDesc,
    verificationData: {
      protocol: "Teleportation-QDS-Pauli-XYZ",
      targetClearance: "Top-Secret-QDS-Level-5",
      channelCoherence: "98.4%",
      stateVector: qState === '|0⟩' ? "[1.000, 0.000]" : qState === '|1⟩' ? "[0.000, 1.000]" : qState === '|+⟩' ? "[0.707, 0.707]" : "[0.707, -0.707]"
    }
  };

  const fileContentStr = JSON.stringify(fileContentObj, null, 2);

  return {
    requestId,
    senderIdentity: sender,
    claimedIdentity: claimed,
    authorizationStatus: authStatus,
    quantumState: qState,
    measurementBasis: basis,
    nonce,
    measurementSamples: expectedBits.length,
    expectedPattern: expected,
    observedPattern: observed,
    statisticalThreshold: 20,
    confidenceThreshold: 85,
    fileName: sampleFileName,
    fileContent: fileContentStr,
    fileSize: new Blob([fileContentStr]).size,
    fileType: sampleFileName.endsWith('.json') ? 'application/json' : 'application/octet-stream',
    uploadTime: now.toLocaleTimeString()
  };
}

/**
 * Seed verification history if user has never verified anything yet
 */
export function getInitialHistorySeed(): VerificationHistoryItem[] {
  const seedItems: Array<{
    scenario: 'NORMAL' | 'FORGERY' | 'IMPERSONATION' | 'REPLAY' | 'UNAUTHORIZED';
    offsetMinutes: number;
  }> = [
    { scenario: 'NORMAL', offsetMinutes: 45 },
    { scenario: 'FORGERY', offsetMinutes: 38 },
    { scenario: 'NORMAL', offsetMinutes: 29 },
    { scenario: 'IMPERSONATION', offsetMinutes: 21 },
    { scenario: 'REPLAY', offsetMinutes: 14 },
    { scenario: 'NORMAL', offsetMinutes: 8 },
    { scenario: 'UNAUTHORIZED', offsetMinutes: 2 },
  ];

  const results: VerificationHistoryItem[] = [];

  for (const s of seedItems) {
    const input = generateDemoScenario(s.scenario, results);
    const date = new Date(Date.now() - s.offsetMinutes * 60 * 1000);
    input.uploadTime = date.toLocaleTimeString();

    const evaluated = calculateVerification(input, results);
    evaluated.timestamp = date.toISOString();

    results.push({
      id: evaluated.id,
      requestId: evaluated.requestId,
      timestamp: evaluated.timestamp,
      sender: evaluated.senderIdentity,
      claimedIdentity: evaluated.claimedIdentity,
      verificationType: 'Demo Simulation',
      threatType: evaluated.threatType,
      mismatchRate: evaluated.mismatchRate,
      attackProbability: evaluated.attackProbability,
      confidence: evaluated.attackConfidence,
      quantumThreatScore: evaluated.quantumThreatScore,
      status: evaluated.status,
      fileName: evaluated.fileName || 'quantum_signature.sig',
      nonce: evaluated.nonce,
      result: evaluated
    });
  }

  return results;
}
