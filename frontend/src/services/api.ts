import { DashboardStats, SystemMetrics, LogEntry, VerificationResult, DemoScenario, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('quantguard_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginApi(username: string, password: string): Promise<{ access_token: string; user: User }> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(err.detail || 'Authentication failed');
  }
  return res.json();
}

export async function getMeApi(): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  return res.json();
}

export async function getDashboardStatsApi(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getMetricsApi(): Promise<SystemMetrics> {
  const res = await fetch(`${API_BASE}/metrics`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch system metrics');
  return res.json();
}

export async function getLogsApi(verdict = 'ALL', search = '', limit = 50, offset = 0): Promise<{ total: number; logs: LogEntry[] }> {
  const params = new URLSearchParams({
    verdict,
    search,
    limit: limit.toString(),
    offset: offset.toString(),
  });
  const res = await fetch(`${API_BASE}/logs?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function getDemoScenariosApi(): Promise<{ scenarios: DemoScenario[] }> {
  const res = await fetch(`${API_BASE}/demo-scenarios`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch demo scenarios');
  return res.json();
}

export async function verifyDemoApi(scenario: string, verifier_id?: string, signer_id?: string): Promise<VerificationResult> {
  const res = await fetch(`${API_BASE}/verify/demo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ scenario, verifier_id, signer_id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Demo verification failed' }));
    throw new Error(err.detail || 'Demo verification failed');
  }
  return res.json();
}

export async function verifyFileApi(file: File, verifier_id: string, signer_id: string, nonce?: string): Promise<VerificationResult> {
  const token = localStorage.getItem('quantguard_token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('verifier_id', verifier_id);
  formData.append('signer_id', signer_id);
  if (nonce) formData.append('nonce', nonce);

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Verification failed' }));
    throw new Error(err.detail || 'Verification failed');
  }
  return res.json();
}

export async function registerSignatureApi(file: File, signer_id: string, description: string): Promise<any> {
  const token = localStorage.getItem('quantguard_token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signer_id', signer_id);
  formData.append('description', description);

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function getRegisteredSignaturesApi(): Promise<{ registered_signatures: any[] }> {
  const res = await fetch(`${API_BASE}/registered-signatures`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch registered signatures');
  return res.json();
}

export async function getVerifiersApi(): Promise<{ verifiers: any[] }> {
  const res = await fetch(`${API_BASE}/verifiers`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch verifiers');
  return res.json();
}
