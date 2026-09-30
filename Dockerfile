# ========================================================
# QUANTGUARD // MULTI-STAGE PRODUCTION DOCKERFILE
# Stage 1: Build React Frontend UI
# Stage 2: Hardened Python 3.11 Runtime for Unified Server
# ========================================================

# --- Stage 1: Frontend Builder ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies with caching
COPY frontend/package*.json ./
RUN npm install

# Build static React SPA assets
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Production Python Unified Service ---
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    PYTHONPATH=/app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend distribution bundle from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy sample cryptographic signatures
COPY sample_signatures/ ./sample_signatures/

# Seed initial historical dataset and registered keys
RUN python backend/seed_data.py

EXPOSE 8000

# Start QuantGuard unified server on $PORT (defaults to 8000)
CMD ["sh", "-c", "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]