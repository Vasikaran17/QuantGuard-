import hmac
import hashlib
import base64
import json
import time
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "quantguard-sih-2026-teleportation-qds-token-key"
ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 86400  # 24 hours

DEMO_USER = {
    "username": "admin",
    "password": "QuantGuard@2026",
    "name": "SIH Defense Command Admin",
    "role": "Chief Quantum Security Officer",
    "clearance": "Top-Secret-QDS-Level-5"
}

security = HTTPBearer(auto_error=False)

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(payload: Dict[str, Any], expires_in: int = TOKEN_EXPIRY_SECONDS) -> str:
    header = {"alg": ALGORITHM, "typ": "JWT"}
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    header_b64 = base64url_encode(header_json)

    token_payload = dict(payload)
    token_payload["iat"] = int(time.time())
    token_payload["exp"] = int(time.time()) + expires_in
    payload_json = json.dumps(token_payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64url_encode(payload_json)

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = base64url_decode(sig_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))

        if payload.get("exp", 0) < time.time():
            return None

        return payload
    except Exception:
        return None

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    if username == DEMO_USER["username"] and password == DEMO_USER["password"]:
        return {
            "username": DEMO_USER["username"],
            "name": DEMO_USER["name"],
            "role": DEMO_USER["role"],
            "clearance": DEMO_USER["clearance"]
        }
    return None

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Dict[str, Any]:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token. Please login.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return payload
