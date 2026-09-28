#!/usr/bin/env bash
set -e

echo "========================================================"
echo "  QUANTGUARD // QUANTUM DIGITAL SIGNATURE DEFENSE"
echo "  Building and Launching Unified Production Service..."
echo "========================================================"

echo ""
echo "[1/3] Building React Frontend Bundle..."
cd frontend
npm run build
cd ..

echo ""
echo "[2/3] Initializing Backend & Seed Data..."
cd backend
python -m pip install -r requirements.txt
python seed_data.py

echo ""
echo "[3/3] Starting Unified Production Server on http://0.0.0.0:8000 ..."
echo "[INFO] Serving React Frontend UI and FastAPI REST Endpoints concurrently."
echo "[INFO] Demo Credentials: admin / QuantGuard@2026"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8000
